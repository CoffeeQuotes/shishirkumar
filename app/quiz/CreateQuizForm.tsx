import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddNewQuestionForm from "./AddNewQuestionForm";
import { categories } from "./QuizConstants";
import {
  cardClasses,
  cardHeaderClasses,
  cardTitleClasses,
  cardDescriptionClasses,
  cardContentClasses,
  cardFooterClasses,
  inputClasses,
  selectClasses,
  primaryButtonClasses,
  ghostButtonClasses,
  labelClasses
} from "./QuizConstants";

interface CreateQuizFormProps {
  newQuiz: {
    title: string;
    category: string;
    questions: Array<{
      id: string;
      text: string;
      options: string[];
      correctAnswer: string;
    }>;
  };
  onTitleChange: (title: string) => void;
  onCategoryChange: (category: string) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
}

const CreateQuizForm: React.FC<CreateQuizFormProps> = ({
  newQuiz,
  onTitleChange,
  onCategoryChange,
  onSubmit,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  // Fixed Stable Components
  const StableQuizTitleInput = React.useMemo(() => (
    <input
    id="quizTitle"
    type="text"
    value={newQuiz.title}
    onChange={(e) => onTitleChange(e.target.value)}
    placeholder="e.g., Basic JavaScript Concepts"
    className={`${inputClasses} w-full`}
    />
  ), [newQuiz.title, onTitleChange]);

  const StableCategorySelect = React.useMemo(() => (
    <div className="relative">
    <select
    id="quizCategory"
    value={newQuiz.category}
    onChange={(e) => onCategoryChange(e.target.value)}
    className={`${selectClasses} w-full`}
    >
    {categories.map((category) => (
      <option key={category} value={category}>
      {category}
      </option>
    ))}
    </select>
    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  ), [newQuiz.category, onCategoryChange]);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      if (!newQuiz.title?.trim()) {
        toast({ title: "Missing Title", description: "Please enter a quiz title", variant: "destructive" });
        return;
      }
      if (!newQuiz.questions?.length) {
        toast({ title: "No Questions", description: "Please add at least one question", variant: "destructive" });
        return;
      }
      await onSubmit();
    } catch (error) {
      console.error("Submission error:", error);
    } finally { 
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-0">
    <div className={`${cardClasses} max-w-3xl mx-auto w-full`}>
    <div className={`${cardHeaderClasses} px-4 sm:px-6`}>
    <h2 className={cardTitleClasses}>Create New Quiz</h2>
    <p className={`${cardDescriptionClasses} mt-1`}>Fill in the details for your new quiz.</p>
    </div>

    <div className={`${cardContentClasses} space-y-6 px-4 sm:px-6`}>
    <div>
    <label htmlFor="quizTitle" className={labelClasses}>Quiz Title</label>
    {StableQuizTitleInput}
    </div>

    <div>
    <label htmlFor="quizCategory" className={labelClasses}>Category</label>
    {StableCategorySelect}
    </div>

    <hr className="border-border" />

    {/* Current Questions */}
    <div className="space-y-3">
    <h3 className="text-base font-semibold">
    Current Questions ({(newQuiz.questions || []).length})
    </h3>
    {newQuiz.questions && newQuiz.questions.length > 0 ? (
      <div className="space-y-3 max-h-64 overflow-y-auto p-2 border rounded-md sm:p-3">
      {newQuiz.questions.map((question, index) => (
        <div key={question.id} className="p-3 bg-muted/30 rounded-md">
        <p className="font-medium">Q{index + 1}: {question.text}</p>
        <div className="mt-2 text-sm text-muted-foreground">
        <span className="font-medium">Correct Answer:</span> {question.correctAnswer}
        </div>
        </div>
      ))}
      </div>
    ) : (
      <p className="text-sm text-muted-foreground italic">No questions added yet.</p>
    )}
    </div>

    {/* Add Question Form */}
    <div className="bg-muted/20 p-4 rounded-md">
    <h3 className="text-base font-semibold mb-4">Add New Question</h3>
    <AddNewQuestionForm />
    </div>
    </div>

    <div className={`${cardFooterClasses} justify-between px-4 sm:px-6 flex-wrap gap-2`}>
    <button
    type="button"
    onClick={onCancel}
    className={`${ghostButtonClasses} px-4 py-2 w-full sm:w-auto order-2 sm:order-1`}
    >
    Cancel
    </button>
    <button
    type="button"
    disabled={isProcessing}
    onClick={handleSubmit}
    className={`${primaryButtonClasses} px-4 py-2 w-full sm:w-auto order-1 sm:order-2`}
    >
     {isProcessing ? "Saving..." : "Save Quiz"} 

    </button>
    </div>
    </div>
    </div>
  );
};

export default CreateQuizForm;
