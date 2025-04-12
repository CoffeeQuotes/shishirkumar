// app/quiz/CreateQuizForm.tsx
import React from "react";
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

  // Fixed Stable Components
  const StableQuizTitleInput = React.useMemo(() => (
    <input
      id="quizTitle"
      type="text"
      value={newQuiz.title}
      onChange={(e) => onTitleChange(e.target.value)}
      placeholder="e.g., Basic JavaScript Concepts"
      className={inputClasses}
    />
  ), [newQuiz.title, onTitleChange]);

  const StableCategorySelect = React.useMemo(() => (
    <div className="relative">
      <select
        id="quizCategory"
        value={newQuiz.category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={selectClasses}
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
    }
  };

  return (
    <div className={`${cardClasses} max-w-3xl mx-auto`}>
      <div className={cardHeaderClasses}>
        <h2 className={cardTitleClasses}>Create New Quiz</h2>
        <p className={`${cardDescriptionClasses} mt-1`}>Fill in the details for your new quiz.</p>
      </div>
      
      <div className={`${cardContentClasses} space-y-6`}>
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
        {/* ... questions list ... */}
        </div>

        {/* Add Question Form - THIS WAS MISSING */}
        <AddNewQuestionForm />
        </div>
      
      <div className={`${cardFooterClasses} justify-between`}>
        <button type="button" onClick={onCancel} className={`${ghostButtonClasses} px-4 py-2`}>
          Cancel
        </button>
        <button type="button" onClick={handleSubmit} className={`${primaryButtonClasses} px-4 py-2`}>
          Save Quiz
        </button>
      </div>
    </div>
  );
};

export default CreateQuizForm;