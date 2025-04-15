'use client';
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <button
          onClick={() => signIn()}
          className="px-6 py-3 font-semibold bg-primary text-primary-foreground rounded-md"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-card shadow-lg">
        <h1 className="text-2xl font-bold text-center text-card-foreground">Quiz Platform</h1>

        <div className="flex items-center justify-center p-4 rounded-md bg-muted">
          <div className="flex flex-col items-center gap-2">
            {session.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
            )}
            <p className="text-lg">
              Signed in as <span className="font-medium">{session.user?.name}</span>
            </p>
            <p className="text-sm text-muted-foreground">{session.user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full py-3 font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
        >
          Sign out
        </button>

        <p className="text-center text-muted-foreground text-sm mt-4">Happy Quizzing!</p>
      </div>
    </div>
  );
}
