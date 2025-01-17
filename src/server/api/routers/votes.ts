import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  dbtCategory,
  dbtNomination,
  dbtVote,
} from "@/server/db/schema/aposcar";
import { users } from "@/server/db/schema/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

const getCurrentUserVotesSchema = z.object({
  id: z.string(),
  isWinner: z.boolean(),
  categoryName: z.string(),
});

const castVoteInputSchema = z.object({
  nominationId: z.string(),
});

export const votesRouter = createTRPCRouter({
  getCurrentUserVotes: protectedProcedure
    .output(getCurrentUserVotesSchema.array())
    .query(async ({ ctx }) => {
      const results = await ctx.db
        .select({
          id: dbtVote.id,
          isWinner: dbtNomination.isWinner,
          categoryName: dbtCategory.name,
        })
        .from(dbtVote)
        .innerJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
        .innerJoin(dbtCategory, eq(dbtVote.category, dbtCategory.id))
        .innerJoin(users, eq(users.id, ctx.session.user.id));
      return results;
    }),
  castVote: protectedProcedure
    .input(castVoteInputSchema)
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(dbtVote)
        .values({ nomination: input.nominationId, user: ctx.session.user.id });
      return {
        success: true,
      };
    }),
});
