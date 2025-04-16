import { toast } from "@/hooks/use-toast";
import { type Quiz } from "@/lib/definitions";

export async function fetchQuizzes(toast: any): Promise<Quiz[]> {
  try {
    const response = await fetch('/api/quizzes');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error: any) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
    return [];
  }
}

export async function saveQuizToJson(quiz: Quiz, toast: any, userId?: string): Promise<boolean> {
  try {
    const finalQuiz = {
      ...quiz,
      userId, // Dynamically attach userId here
      id: quiz.id || Date.now().toString(), // Ensure there's always an id
    };

    const response = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalQuiz),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save quiz');
    }

    return true;
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    });
    return false;
  }
}
