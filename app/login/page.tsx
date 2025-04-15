"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Github, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  // Only render the login UI if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-card shadow-lg">
          <h1 className="text-2xl font-bold text-center text-card-foreground">Quiz Platform</h1>
          
          <div className="flex flex-col space-y-4 items-center">
            <div className="bg-muted p-6 rounded-md w-full text-center">
              <p className="text-lg mb-6">You are not signed in</p>
              
              <button
                onClick={() => signIn("github")}
                className="flex items-center justify-center gap-2 w-full py-3 font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
              >
                <Github size={20} />
                Sign in with GitHub
              </button>
            </div>
          </div>
          
          <p className="text-center text-muted-foreground text-sm mt-4">Sign in to create and take quizzes</p>
        </div>
      </div>
    );
  }

  // If we get here, the user is authenticated but the redirect hasn't happened yet
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Redirecting...</p>
      </div>
    </div>
  );
}