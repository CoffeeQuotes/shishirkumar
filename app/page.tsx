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
          className="btn-brave text-white font-semibold px-6 py-3"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="brave-card w-full max-w-md p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-card-foreground">
          Ashy
        </h1>

        <div className="flex items-center justify-center p-4 rounded-lg bg-muted">
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
        <div className="flex gap-4">
          <a href="/learn" className="btn-brave flex items-center justify-center gap-2 w-full py-3 font-medium text-white" aria-label="Learn">
            Learn
          </a>
          <a href="/quiz" className="btn-brave-secondary flex items-center justify-center gap-2 w-full py-3 font-medium" aria-label="Quiz">
            Quiz
          </a>
        </div>    
        <button
          onClick={() => signOut()}
          className="btn-brave w-full py-3 font-medium text-white"
          aria-label="Sign out"
        >
          Sign out
        </button>
        <p className="text-center text-muted-foreground text-sm mt-4">
            Powered by Next.js, TailwindCSS, NextAuth.js, Prisma, PlanetScale, Vercel
        </p>
        <p className="text-center text-muted-foreground text-sm">
            Shishir Kumar &copy; All right reserved. {new Date().getFullYear()} 
        </p>
      </div>
    </div>
  );
}
