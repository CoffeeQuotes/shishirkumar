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

export interface CheatsheetSectionProps {
    section: {
        id: string;
        title: string;
        items: Array<{ copyId: string; [key: string]: any }>;
    };
    tab: string;
    copyState: {
        id: string;
    };
    onCopyCode: (id: string) => void;
}

export interface TabData {
    id: string;
    title: string;
    intro: string;
    colorClasses: {
        triggerActive: string;
        introBg: string;
        introBorder: string;
        introText: string;
    };
    sections: {
        id: string;
        [key: string]: any;
    }[];
}

export interface CheatsheetTabsProps {
    filteredData: TabData[];
    allData: TabData[];
    searchTerm: string;
    defaultAccordionValues: Record<string, string>;
    copyState: Record<string, boolean>;
    onCopyCode: (id: string) => void;
}


export interface Item {
    concept: string;
    description: string;
    note?: string;
    code: string;
}

export interface Section {
    id: string;
    title: string;
    items: Item[];
}

export interface Tab {
    id: string;
    title: string;
    sections: Section[];
}
// Define CopyState type for proper type checking
export interface CopyState {
    id: string | null;
    timestamp: number;
}

export type QuizListItem = {
    id: string;
    title: string;
    category: string;
    questions: any[];
};