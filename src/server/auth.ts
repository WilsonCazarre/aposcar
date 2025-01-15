import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
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
  providers: [Google],
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role as UserSelect["role"];
      return session;
    },
  },
});
