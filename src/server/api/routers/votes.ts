import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import {
  dbtCategory,
  dbtMovie,
  dbtNomination,
  dbtVote,
} from "@/server/db/schema/aposcar";
import { users } from "@/server/db/schema/auth";
import { TRPCError } from "@trpc/server";
import { count, eq, sql } from "drizzle-orm";
import { z } from "zod";

const getCurrentUserVotesSchema = z.object({
  id: z.string(),
  isWinner: z.boolean(),
  categoryName: z.string(),
});

const castVoteInputSchema = z.object({
  nominationId: z.string(),
  categoryId: z.string(),
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
      console.log({ input });
      const user = (
        await ctx.db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.email, ctx.session.user.email ?? ""))
      ).at(0);
      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });

      // DELETE with JOINS are not yet available on drizzle
      // https://github.com/drizzle-team/drizzle-orm/issues/3100
      await ctx.db.execute(sql`
        DELETE FROM ${dbtVote}
        WHERE
          ${dbtVote.id} IN (
            SELECT
              ${dbtVote.id}
            FROM
              ${dbtVote}
              INNER JOIN ${dbtNomination} ON ${dbtVote.nomination} = ${dbtNomination.id}
              INNER JOIN ${dbtCategory} ON ${dbtNomination.category} = ${dbtCategory.id}
            WHERE
              ${dbtVote.user} = ${user.id}
              AND ${dbtCategory.id} = ${input.categoryId}::uuid
          )  
      `);

      await ctx.db
        .insert(dbtVote)
        .values({ nomination: input.nominationId, user: user.id });
      return {
        success: true,
      };
    }),

  getUserRankings: publicProcedure.query(async ({ ctx }) => {
    const results = await ctx.db
      .select({
        email: users.email,
        role: users.role,
        name: users.name,
        profilePic: users.image,
        score: count(),
      })
      .from(dbtVote)
      .innerJoin(users, eq(dbtVote.user, users.id))
      .innerJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
      .groupBy(dbtVote.user, users.email, users.role, users.name, users.image)
      .where(dbtNomination.isWinner.getSQL());
    return results;
  }),
});
