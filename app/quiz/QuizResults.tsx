import React from "react";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import {
    cardClasses,
    cardHeaderClasses,
    cardTitleClasses,
    cardDescriptionClasses,
    cardContentClasses,
    cardFooterClasses,
    primaryButtonClasses,
    successAlertClasses,
    destructiveAlertClasses
} from "./QuizConstants";

interface QuizResultsProps {
    quiz: {
        title: string;
        questions: Array<{
            id: string;
            text: string;
            options: string[];
            correctAnswer: string;
        }>;
    };
    userAnswers: Record<string, string>;
    score: number;
    onReset: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
                                                     quiz,
                                                     userAnswers,
                                                     score,
                                                     onReset
                                                 }) => {
    return (
        <div className={`${cardClasses} max-w-3xl mx-auto`}>
            <div className={cardHeaderClasses}>
                <h2 className={cardTitleClasses}>Quiz Results: {quiz.title}</h2>
                <p className={`${cardDescriptionClasses} mt-1`}>
                    Your score: {score} out of {quiz.questions.length} (
                    {((score / quiz.questions.length) * 100).toFixed(0)}%)
                </p>
            </div>
            <div className={`${cardContentClasses} space-y-4`}>
                <h3 className="text-lg font-medium mb-3">Review Your Answers:</h3>
                {quiz.questions.map((question, index) => {
                    const userAnswer = userAnswers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    return (
                        <div
                            key={question.id}
                            className={isCorrect ? successAlertClasses : destructiveAlertClasses}
                        >
                            {isCorrect ? (
                                <CheckCircle className="h-4 w-4" />
                            ) : (
                                <XCircle className="h-4 w-4" />
                            )}
                            <div>
                                <h4 className="font-medium">
                                    Question {index + 1}: {question.text}
                                </h4>
                                <div className="mt-2 space-y-1 text-sm">
                                    <div>
                                        Your answer:{" "}
                                        <span className={!isCorrect ? "line-through text-muted-foreground" : ""}>
                      {userAnswer || "Not answered"}
                    </span>
                                    </div>
                                    <div>
                                        Correct answer:{" "}
                                        <span className="font-medium">{question.correctAnswer}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className={`${cardFooterClasses} justify-center`}>
                <button
                    type="button"
                    onClick={onReset}
                    className={`${primaryButtonClasses} px-4 py-2`}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Quizzes
                </button>
            </div>
        </div>
    );
};

export default QuizResults;