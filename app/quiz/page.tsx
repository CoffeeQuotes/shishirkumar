"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { categories } from "./QuizConstants";
import QuizLayout from "./QuizLayout";
import QuizList from "./QuizList";
import CreateQuizForm from "./CreateQuizForm";
import QuizQuestion from "./QuizQuestion";
import QuizResults from "./QuizResults";
import { fetchQuizzes, saveQuizToJson } from "./quizUtils";
import { type Quiz } from "@/lib/definitions";

// Define the expected quiz type for QuizList component
type QuizListItem = {
  id: string;
  title: string;
  category: string;
  questions: any[];
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isCreating, setIsCreating] = useState(false);
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
  const { toast } = useToast();

  // Load quizzes on mount
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzes(toast);
        setQuizzes(data.filter(quiz => quiz.id !== undefined) as Quiz[]);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuizzes();
  }, [toast]);

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


  if (isLoading) {
    return <QuizLayout loading />;
  }

  if (selectedQuizId) {
    const selectedQuiz = quizzes.find(q => q.id === selectedQuizId);
    if (!selectedQuiz) return <QuizLayout>Quiz not found</QuizLayout>;

    if (quizCompleted) {
      return (
          <QuizLayout>
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
      <QuizLayout>
        <QuizQuestion
          quiz={selectedQuiz}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          onAnswerSelect={handleAnswerSelect}  // Updated this line
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
        <QuizLayout>
          <CreateQuizForm
              newQuiz={newQuiz}
              onTitleChange={(title) => setNewQuiz(prev => ({ ...prev, title }))}
              onCategoryChange={(category) => setNewQuiz(prev => ({ ...prev, category }))}
              onSubmit={async () => {
                const success = await saveQuizToJson(newQuiz, toast);
                if (success) {
                  setNewQuiz({ id: Date.now().toString(), title: "", category: categories[0], questions: [] });
                  setIsCreating(false);
                  const data = await fetchQuizzes(toast);
                  setQuizzes(data.filter(quiz => quiz.id !== undefined) as Quiz[]);
                }
              }}
              onCancel={() => setIsCreating(false)}
          />
        </QuizLayout>
    );
  }

  return (
      <QuizLayout>
        <QuizList
                quizzes={quizzes.filter(quiz => quiz.id !== undefined) as QuizListItem[]}
                filterCategory={filterCategory}
                onFilterChange={setFilterCategory}
                onCreateNew={() => setIsCreating(true)}
                onStartQuiz={startQuiz}
            />
      </QuizLayout>
  );
}