"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { categories } from "./QuizConstants";
import { useRouter } from "next/navigation";
import QuizLayout from "./QuizLayout";
import QuizList from "./QuizList";
import CreateQuizForm from "./CreateQuizForm";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import { fetchQuizzes, saveQuizToJson } from "./quizUtils";
import { type Quiz , type Question, QuizListItem } from "@/lib/definitions";
import {useTheme} from "next-themes";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function QuizPage() {
  const { data: session, status } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { theme, setTheme } = useTheme();
  const [newQuiz, setNewQuiz] = useState<Quiz>({
    id: Date.now().toString(), // Adding a default id
    title: "",
    category: categories[0],
    questions: [],
  });
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [filterCategory, setFilterCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination state
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  const { toast } = useToast();
  const router = useRouter();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
 
  // Load quizzes with pagination
  useEffect(() => {
    const loadQuizzes = async () => {
      setIsLoading(true);
      try {
        const data = await fetchQuizzes(toast, {
          page: currentPage,
          limit: itemsPerPage,
          category: filterCategory !== "All" ? filterCategory : undefined
        });
        
        setQuizzes(data.quizzes.filter(quiz => quiz.id !== undefined) as Quiz[]);
        setTotalQuizzes(data.totalCount);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuizzes();
  }, [toast, currentPage, itemsPerPage, filterCategory]);

  useEffect(() => {
    const handleAddQuestion = (event: Event) => {
      const customEvent = event as CustomEvent<Question>;
      if (customEvent.detail) {
        setNewQuiz(prev => ({
          ...prev,
          questions: [
            ...(prev.questions || []),
            {
              ...customEvent.detail,
              id: customEvent.detail.id || Date.now().toString()
            }
          ]
        }));
      }
    };

    document.addEventListener('addquestion', handleAddQuestion);
    return () => document.removeEventListener('addquestion', handleAddQuestion);
  }, []);

  // Quiz taking logic
  const startQuiz = useCallback((quizId: string) => {
    setSelectedQuizId(quizId);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setScore(0);
  }, []);

  const resetQuiz = useCallback(() => {
    setSelectedQuizId(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizCompleted(false);
  }, []);

  const handleAnswerSelect = useCallback((questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);
  
  // Pagination handlers - defined only once
  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
  }, []);
  
  const handleItemsPerPageChange = useCallback((itemsCount: number) => {
    setItemsPerPage(itemsCount);
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  if(!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return <QuizLayout loading theme={theme} setTheme={setTheme} />;
  }
  
  if (selectedQuizId) {
    const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);
    if (!selectedQuiz) return <QuizLayout theme={theme} setTheme={setTheme} >Quiz not found</QuizLayout>;

    if (quizCompleted) {
      return (
        <QuizLayout theme={theme} setTheme={setTheme}>
          <QuizResults
            quiz={selectedQuiz}
            userAnswers={userAnswers}
            score={score}
            onReset={resetQuiz}
          />
        </QuizLayout>
      );
    }

    return (
      <QuizLayout theme={theme} setTheme={setTheme}>
        <QuizQuestion
          quiz={selectedQuiz}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswerSelect={handleAnswerSelect}
          onNextQuestion={() => {
            if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
            } else {
              const correctAnswers = selectedQuiz.questions.filter(
                q => userAnswers[q.id] === q.correctAnswer
              ).length;
              setScore(correctAnswers);
              setQuizCompleted(true);
            }
          }}
          onQuit={resetQuiz}
        />
      </QuizLayout>
    );
  }

  if (isCreating) {
    return (
      <QuizLayout theme={theme} setTheme={setTheme}>
        <CreateQuizForm
          newQuiz={newQuiz}
          onTitleChange={(title) => setNewQuiz(prev => ({ ...prev, title }))}
          onCategoryChange={(category) => setNewQuiz(prev => ({ ...prev, category }))}
          onSubmit={async () => {
            const success = await saveQuizToJson(newQuiz, toast, session?.user?.id);
            if (success) {
              setNewQuiz({ id: Date.now().toString(), title: "", category: categories[0], questions: [] });
              setIsCreating(false);
              
              // Refresh the quizzes after creating a new one
              const data = await fetchQuizzes(toast, {
                page: 1, // Go back to first page
                limit: itemsPerPage,
                category: filterCategory !== "All" ? filterCategory : undefined
              });
              
              setQuizzes(data.quizzes.filter(quiz => quiz.id !== undefined) as Quiz[]);
              setTotalQuizzes(data.totalCount);
              setCurrentPage(1); // Reset to first page to see the new quiz
            }
          }}
          onCancel={() => setIsCreating(false)}
        />
      </QuizLayout>
    );
  }

  return (
    <QuizLayout theme={theme} setTheme={setTheme}>
      <QuizList
        quizzes={quizzes}
        filterCategory={filterCategory}
        onFilterChange={(category) => {
          setFilterCategory(category);
          setCurrentPage(1); // Reset to first page on filter change
        }}
        onCreateNew={() => setIsCreating(true)}
        onStartQuiz={startQuiz}
        pagination={{
          currentPage,
          totalPages: Math.ceil(totalQuizzes / itemsPerPage),
          itemsPerPage,
          onPageChange: handlePageChange,
          onItemsPerPageChange: handleItemsPerPageChange,
          totalItems: totalQuizzes
        }}
      />
    </QuizLayout>
  );
}