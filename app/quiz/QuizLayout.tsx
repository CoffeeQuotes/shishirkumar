import React from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
const QuizLayout: React.FC<{
    children?: React.ReactNode;
    loading?: boolean;
    theme?: string;
    setTheme: (theme: string) => void;
}> = ({ children, loading, theme, setTheme }) => {
    if (loading) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
                    <div className="container flex h-16 items-center justify-between">
                        <h1 className="text-2xl font-semibold">Quiz Platform</h1>
                        <div className="flex items-center gap-4">
                            <ThemeToggle theme={theme || "light"} setTheme={(value) => setTheme(value)} />
                        </div>
                    </div>
                </header>
                <main className="container py-6 md:py-10">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading quizzes...</p>
                        </div>
                    </div>
                </main>
                <footer className="border-t py-4 md:py-0">
                    <div className="container flex h-14 items-center justify-center">
                        <p className="text-center text-sm text-muted-foreground">Happy Quizzing!</p>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
                <div className="container flex h-16 items-center justify-between">
                    <h1 className="text-2xl font-semibold">Quiz Platform</h1>
                    <div className="flex items-center gap-4">
                        <ThemeToggle theme={theme || "light"} setTheme={(value) => setTheme(value)} />
                    </div>
                </div>
            </header>
            <main className="container py-6 md:py-10">
                {children}
            </main>
            <footer className="border-t py-4 md:py-0">
                <div className="container flex h-14 items-center justify-center">
                    <p className="text-center text-sm text-muted-foreground">Happy Quizzing!</p>
                </div>
            </footer>
        </div>
    );
};

export default QuizLayout;