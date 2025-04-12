import React from "react";
import { PlusCircle, Info } from "lucide-react";
import QuizCard from "./QuizCard";
import EmptyState from "./EmptyState";
import {
    cardClasses,
    cardHeaderClasses,
    cardTitleClasses,
    cardContentClasses,
    primaryButtonClasses,
    selectClasses,
    labelClasses
} from "./QuizConstants";

interface QuizListProps {
    quizzes: Array<{
        id: string;
        title: string;
        category: string;
        questions: any[];
    }>;
    filterCategory: string;
    onFilterChange: (category: string) => void;
    onCreateNew: () => void;
    onStartQuiz: (id: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({
                                               quizzes,
                                               filterCategory,
                                               onFilterChange,
                                               onCreateNew,
                                               onStartQuiz,
                                           }) => {
    const filteredQuizzes = filterCategory === "All"
        ? quizzes
        : quizzes.filter(quiz => quiz.category === filterCategory);

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <label htmlFor="filterCategory" className={`${labelClasses} mb-0 whitespace-nowrap`}>
                        Filter:
                    </label>
                    <div className="relative w-full sm:w-[200px]">
                        <select
                            id="filterCategory"
                            value={filterCategory}
                            onChange={(e) => onFilterChange(e.target.value)}
                            className={selectClasses}
                        >
                            <option value="All">All Categories</option>
                            {quizzes
                              .map(quiz => quiz.category)
                              .filter((category, index, self) => self.indexOf(category) === index)
                              .map((category: string) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                              ))}
                        </select>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onCreateNew}
                    className={`${primaryButtonClasses} px-4 py-2 w-full sm:w-auto`}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Create New Quiz
                </button>
            </div>
            <hr className="border-border mb-6" />
            {filteredQuizzes.length === 0 ? (
                <EmptyState
                    hasQuizzes={quizzes.length > 0}
                    filterCategory={filterCategory}
                    onCreateNew={onCreateNew}
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuizzes.map((quiz) => (
                        <QuizCard
                            key={quiz.id}
                            quiz={quiz}
                            onStartQuiz={onStartQuiz}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default QuizList;