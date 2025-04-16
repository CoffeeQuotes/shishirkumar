import React from "react";
import { PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
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

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
    totalItems: number;
}

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
    pagination: PaginationProps;
}

const PaginationControls: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
    totalItems
}) => {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // If we have fewer pages than our max, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page
            pages.push(1);
            
            // Calculate start and end of visible page range
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if we're at the beginning
            if (currentPage <= 2) {
                end = Math.min(totalPages - 1, 4);
            }
            
            // Adjust if we're at the end
            if (currentPage >= totalPages - 1) {
                start = Math.max(2, totalPages - 3);
            }
            
            // Add ellipsis if needed
            if (start > 2) {
                pages.push("...");
            }
            
            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push("...");
            }
            
            // Always include last page if there's more than one page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();
    
    return (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
                Showing {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} quizzes
            </div>
            
            <div className="flex items-center gap-2">
                <div className="mr-4">
                    <select 
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className={`${selectClasses} w-16`}
                        aria-label="Items per page"
                    >
                        <option value={6}>6</option>
                        <option value={9}>9</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                    </select>
                </div>
                
                <nav className="flex items-center gap-1" aria-label="Pagination">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`${primaryButtonClasses} px-2 py-1 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {pageNumbers.map((page, index) => (
                        React.isValidElement(page) || typeof page === "number" ? (
                            <button
                                key={index}
                                onClick={() => onPageChange(page as number)}
                                className={`px-3 py-1 rounded-md ${
                                    currentPage === page 
                                        ? 'bg-primary text-primary-foreground font-medium' 
                                        : 'hover:bg-muted'
                                }`}
                                aria-current={currentPage === page ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        ) : (
                            <span key={index} className="px-2">
                                {page}
                            </span>
                        )
                    ))}
                    
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className={`${primaryButtonClasses} px-2 py-1 ${
                            currentPage === totalPages || totalPages === 0 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                        }`}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </nav>
            </div>
        </div>
    );
};

const QuizList: React.FC<QuizListProps> = ({
    quizzes,
    filterCategory,
    onFilterChange,
    onCreateNew,
    onStartQuiz,
    pagination
}) => {
    // Get all unique categories for the filter dropdown
    const allCategories = [...new Set(
        quizzes.map(quiz => quiz.category)
    )];
    
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
                            {allCategories.map((category: string) => (
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
            
            {quizzes.length === 0 ? (
                <EmptyState
                    hasQuizzes={pagination.totalItems > 0}
                    filterCategory={filterCategory}
                    onCreateNew={onCreateNew}
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                onStartQuiz={onStartQuiz}
                            />
                        ))}
                    </div>
                    
                    {pagination.totalItems > 0 && (
                        <PaginationControls {...pagination} />
                    )}
                </>
            )}
        </>
    );
};

export default QuizList;