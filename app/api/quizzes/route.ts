import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
// Define the quiz types (keep as is or move)
type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  quizId?: string;
};

type Quiz = {
  id: string;
  title: string;
  category: string;
  questions: Question[];
};

// Helper to get quizzes from the database (uses the imported prisma instance)
const getQuizzesFromDB = async (): Promise<Quiz[]> => {
  try {
    const quizzes = await prisma.quiz.findMany({ // Uses imported singleton
      include: {
        questions: true,
      },
      orderBy: { // Optional: Good practice to order results
        createdAt: 'desc',
      }
    });

    // Transform the data (keep as is)
    return quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      category: quiz.category,
      questions: quiz.questions.map(question => ({
        id: question.id,
        text: question.text,
        options: question.options as string[],
        correctAnswer: question.correctAnswer,
      })),
    }));
  } catch (error) {
    console.error("Failed to read quizzes from database:", error);
    throw new Error("Could not retrieve quiz data from database.");
  }
};

// Helper to add a new quiz to the database (uses the imported prisma instance)
const addQuizToDB = async (quiz: Quiz): Promise<Quiz> => {
  try {
    // Uses imported singleton
    const result = await prisma.$transaction(async (tx) => {
      const createdQuiz = await tx.quiz.create({
        data: {
          id: quiz.id,
          title: quiz.title,
          category: quiz.category,
          questions: {
            create: quiz.questions.map(question => ({
              id: question.id,
              text: question.text,
              options: question.options,
              correctAnswer: question.correctAnswer,
            })),
          },
        },
        include: {
          questions: true,
        },
      });


      return {
        id: createdQuiz.id,
        title: createdQuiz.title,
        category: createdQuiz.category,
        questions: createdQuiz.questions.map(question => ({
          id: question.id,
          text: question.text,
          options: question.options as string[],
          correctAnswer: question.correctAnswer,
        })),
      };
    });

    return result;
  } catch (error) {
    console.error("Failed to add quiz to database:", error);
    throw new Error("Could not save quiz data to database.");
  }
};

// --- API Route Handlers --- (Keep GET and POST handlers as they are)
// GET: Retrieve all quizzes
export async function GET() {
  try {
    const quizzes = await getQuizzesFromDB();
    return NextResponse.json(quizzes);
  } catch (error: any) {
    console.error("[API GET Error]", error); // Log the actual error server-side
    return NextResponse.json({ error: error.message || 'Failed to fetch quizzes' }, { status: 500 });
  }
}

// POST: Add a new quiz
export async function POST(request: NextRequest) {
  try {
    let newQuizData: Partial<Quiz>;

    try {
      newQuizData = await request.json();
    } catch (error) {
      console.error("JSON parse error:", error);
      return NextResponse.json({ error: 'Invalid JSON data in request body' }, { status: 400 });
    }

    // Validation (keep as is or enhance)
    if (!newQuizData.title || typeof newQuizData.title !== 'string' || newQuizData.title.trim() === '') {
      return NextResponse.json({ error: 'Quiz title is required' }, { status: 400 });
    }
    if (!newQuizData.category || typeof newQuizData.category !== 'string' || newQuizData.category.trim() === '') {
      return NextResponse.json({ error: 'Quiz category is required' }, { status: 400 });
    }
    if (!newQuizData.questions || !Array.isArray(newQuizData.questions) || newQuizData.questions.length === 0) {
      return NextResponse.json({ error: 'Quiz must have at least one question' }, { status: 400 });
    }
    // Add more validation for question structure/content if necessary


    // Prepare final quiz object (Consider using CUID/UUID from Prisma schema defaults)
    const finalQuiz: Quiz = {
      id: newQuizData.id || Date.now().toString(36) + Math.random().toString(36).substring(2, 9), // Use Prisma defaults if possible
      title: newQuizData.title.trim(),
      category: newQuizData.category.trim(),
      questions: newQuizData.questions.map((q: any, index: number) => ({
        id: q.id || `${finalQuiz.id}-q${index}`, // Ensure unique IDs, Prisma defaults are better
        text: q.text?.trim() || '',
        options: Array.isArray(q.options) ? q.options.map((opt: any) => String(opt).trim()).filter(opt => opt) : [], // Ensure non-empty strings
        correctAnswer: q.correctAnswer?.trim() || '',
      })),
    };

    // Add validation here to ensure correctAnswer is one of the options, etc.

    const createdQuiz = await addQuizToDB(finalQuiz);

    return NextResponse.json(createdQuiz, { status: 201 });

  } catch (error: any) {
    console.error("[API POST Error] Failed to create quiz:");
    console.error("  Message:", error.message);
    if (error.code) console.error("  Prisma Error Code:", error.code);
    console.error("  Stack:", error.stack);
    return NextResponse.json({ error: error.message || 'Failed to create quiz' }, { status: 500 });
  }
}