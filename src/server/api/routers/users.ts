import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { onboardUserInputSchema } from "@/server/api/zod/users";
import { users, userSelectSchema } from "@/server/db/schema/auth";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  onboardUser: protectedProcedure
    .input(onboardUserInputSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ username: input.username, completedOnboarding: new Date() })
        .where(eq(users.id, ctx.session.user.id));

      return { success: true };
    }),
  getUserFromSession: protectedProcedure
    .output(userSelectSchema)
    .query(async ({ ctx }) => {
      const user = (
        await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, ctx.session.user.id))
      ).at(0);
      if (!user) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "User not found" });
      }
      return user
    }),
});
