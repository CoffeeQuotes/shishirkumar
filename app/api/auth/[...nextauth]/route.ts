import NextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {prisma} from "@/lib/prisma";

export const authOptions: AuthOptions = {
    
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
    pages: {
        signIn: "/login",
        // signOut: '/auth/signout',
        // error: '/auth/error',
      },
      callbacks: {
        async session({ session, user }) {
          // Add user ID to the session
          if (session.user) {
            session.user.id = user.id;
          }
          return session;
        },
      },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
