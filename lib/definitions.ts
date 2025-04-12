export type Question = {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
};

export type Quiz = {
    id: string | undefined;
    title: string;
    category: string;
    questions: Question[];
};
