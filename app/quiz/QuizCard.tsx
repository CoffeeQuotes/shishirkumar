import React from "react";
import { ChevronRight } from "lucide-react";
import {
    cardClasses,
    cardHeaderClasses,
    cardTitleClasses,
    cardDescriptionClasses,
    cardFooterClasses,
    primaryButtonClasses,
    secondaryBadgeClasses
} from "./QuizConstants";

interface QuizCardProps {
    quiz: {
        id: string;
        title: string;
        category: string;
        questions: any[];
        user: any[];
    };
    onStartQuiz: (id: string) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStartQuiz }) => {
    return (
        <div className={`${cardClasses} flex flex-col`}>
            <div className={cardHeaderClasses}>
                <h3 className={`${cardTitleClasses} text-lg`}>{quiz.title}</h3>
                <div className={`${cardDescriptionClasses} pt-2 flex items-center gap-2 flex-wrap`}>
                    <span className={`${secondaryBadgeClasses}`}>{quiz.category}</span>
                    <span>·</span>
                    <span>{quiz.questions.length} questions</span>
                    <span>·</span>
                    <span>by <a href="/" className="font-bold hover:underline">{quiz.user.name}</a></span>
                </div>
            </div>
            <div className={`${cardFooterClasses} mt-auto`}>
                <button
                    type="button"
                    onClick={() => onStartQuiz(quiz.id)}
                    className={`${primaryButtonClasses} px-3 py-1.5 text-sm w-full`}
                >
                    Take Quiz <ChevronRight className="ml-1.5 h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default QuizCard;