import NextAuth, { User, type DefaultSession } from "next-auth";
import Google, { GoogleProfile } from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  type UserSelect,
  verificationTokens,
} from "@/server/db/schema/auth";
import { type Adapter } from "next-auth/adapters";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: UserSelect["role"];
      cid: string;
    } & DefaultSession["user"];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends UserSelect {}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }) as Adapter,
  providers: [
    Google({
      profile: (profile: GoogleProfile) => {
        return {
          id: profile.sub,
          email: profile.email,
          image: profile.picture,
          completedOnboarding: null,
          emailVerified: null,
          role: "basic",
          username: profile.email.split("@")[0] ?? profile.name,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // console.dir({ token, user, session, trigger }, { depth: null });
      if (trigger === "update" && session.user.username) {
        token.username = session.user.username;
      }
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token, user, trigger }) {
      if (session?.user) {
        session.user.username = token.username as string;
        session.user.id = token.id as string;
        session.user.role = token.role as UserSelect["role"];
      }

      if (token.username) {
        session.user.username = token.username;
      }
      console.log({ newSession: session });
      return session;
    },
  },
});
