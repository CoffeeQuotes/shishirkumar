// app/quiz/QuizQuestion.tsx
import React from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { 
  cardClasses, 
  cardHeaderClasses, 
  cardTitleClasses, 
  cardContentClasses, 
  cardFooterClasses, 
  primaryButtonClasses,
  ghostButtonClasses,
  secondaryBadgeClasses
} from "./QuizConstants";

interface QuizQuestionProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  onAnswerSelect: (questionId: string, answer: string) => void;
  onNextQuestion: () => void;
  onQuit: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
    quiz,
    currentQuestionIndex,
    userAnswers,
    onAnswerSelect,
    onNextQuestion,
    onQuit,
  }) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
  
    return (
      <div className={`${cardClasses} max-w-3xl mx-auto`}>
      <div className={cardHeaderClasses}>
        <div className="flex justify-between items-start mb-4">
          <h2 className={cardTitleClasses}>{quiz.title}</h2>
          <span className={secondaryBadgeClasses}>
            Question {currentQuestionIndex + 1}/{quiz.questions.length}
          </span>
        </div>
        <p className="text-lg text-foreground">{currentQuestion.text}</p>
      </div>

      <div className={cardContentClasses}>
        <fieldset>
          <legend className="sr-only">Options for: {currentQuestion.text}</legend>
          <div className="space-y-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <label
                key={`${currentQuestion.id}-opt-${index}`}
                className="flex items-center space-x-3 p-3 border rounded-md cursor-pointer hover:bg-muted/50 has-[:checked]:border-primary"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option}
                  checked={userAnswers[currentQuestion.id] === option}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onAnswerSelect(currentQuestion.id, option);
                    }
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <span className="flex-1 text-sm">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={cardFooterClasses}>
        <button onClick={onQuit} className={ghostButtonClasses + " px-4 py-2" + " mr-2"}>
          Quit Quiz
        </button>
        <button
          onClick={onNextQuestion}
          disabled={!userAnswers[currentQuestion.id]}
          className={primaryButtonClasses + " px-4 py-2"}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? "Next" : "Finish"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;