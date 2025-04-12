import React from "react";
import { PlusCircle, Info } from "lucide-react";
import {
    cardClasses,
    cardHeaderClasses,
    cardTitleClasses,
    cardContentClasses,
    primaryButtonClasses
} from "./QuizConstants";

interface EmptyStateProps {
    hasQuizzes: boolean;
    filterCategory: string;
    onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
                                                   hasQuizzes,
                                                   filterCategory,
                                                   onCreateNew
                                               }) => {
    return hasQuizzes ? (
        <div className={`${cardClasses} text-center py-12`}>
            <div className={cardHeaderClasses}>
                <Info className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h2 className={cardTitleClasses}>No quizzes found</h2>
            </div>
            <div className={cardContentClasses}>
                <p className="text-muted-foreground">
                    No quizzes match the category "{filterCategory}". Try 'All Categories'.
                </p>
            </div>
        </div>
    ) : (
        <div className={`${cardClasses} text-center py-12`}>
            <div className={cardHeaderClasses}>
                <Info className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                <h2 className={cardTitleClasses}>No quizzes yet!</h2>
            </div>
            <div className={cardContentClasses}>
                <p className="text-muted-foreground mb-6">
                    Get started by creating your first quiz.
                </p>
                <button
                    type="button"
                    onClick={onCreateNew}
                    className={`${primaryButtonClasses} px-4 py-2`}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create First Quiz
                </button>
            </div>
        </div>
    );
};

export default EmptyState;