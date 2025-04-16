import { toast } from "@/hooks/use-toast";
import { type Quiz } from "@/lib/definitions";

export async function fetchQuizzes(
  toast: any,
  options?: {
    page?: number;
    limit?: number;
    category?: string;
  }
): Promise<{ quizzes: Quiz[]; totalCount: number }> {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.category && options.category !== 'All') params.append('category', options.category);
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await fetch(`/api/quizzes${queryString}`);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error: any) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
    return { quizzes: [], totalCount: 0 };
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
