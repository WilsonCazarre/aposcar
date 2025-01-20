import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import {
  dbtCategoryTypesPoints,
  dbtCategory,
  dbtNomination,
  dbtVote,
  dbtMovie,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { users } from "@/server/db/schema/auth";
import { desc, eq, is, sql, sum } from "drizzle-orm";
import { z } from "zod";

const getCurrentUserVotesSchema = z.object({
  id: z.string(),
  isWinner: z.boolean(),
  categoryName: z.string(),
});

const castVoteInputSchema = z.object({
  nominationId: z.string(),
  categorySlug: z.string(),
});

const getCurrentUserVotesInputSchema = z.object({
  username: z.string(),
});

export const votesRouter = createTRPCRouter({
  // getCurrentUserVotes: protectedProcedure
  //   .output(getCurrentUserVotesSchema.array())
  //   .query(async ({ ctx }) => {
  //     const results = await ctx.db
  //       .select({
  //         id: dbtVote.id,
  //         isWinner: dbtNomination.isWinner,
  //         categoryName: dbtCategory.name,
  //       })
  //       .from(dbtVote)
  //       .innerJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
  //       .innerJoin(dbtCategory, eq(dbtVote.category, dbtCategory.id))
  //       .innerJoin(users, eq(users.id, ctx.session.user.id));
  //     return results;
  //   }),

  castVote: protectedProcedure
    .input(castVoteInputSchema)
    .output(
      z.object({
        success: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.session.user.id);
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
              ${dbtVote.user} = ${ctx.session.user.id}
              AND ${dbtCategory.slug} = ${input.categorySlug}
          )  
      `);

      await ctx.db
        .insert(dbtVote)
        .values({ nomination: input.nominationId, user: ctx.session.user.id });
      return {
        success: true,
      };
    }),

  getUserRankings: publicProcedure.query(async ({ ctx }) => {
    const usersData = await ctx.db
      .select({
        role: users.role,
        username: users.username,
        profilePic: users.image,
        position:
          sql<number>`DENSE_RANK() OVER (ORDER BY COALESCE(SUM(CASE WHEN ${dbtNomination.isWinner} THEN ${dbtCategoryTypesPoints.points} ELSE 0 END), 0) DESC)`.as(
            "position",
          ),
        score:
          sql<number>`COALESCE(SUM(CASE WHEN ${dbtNomination.isWinner} THEN ${dbtCategoryTypesPoints.points} ELSE 0 END), 0)`.as(
            "score",
          ),
      })
      .from(users)
      .leftJoin(dbtVote, eq(dbtVote.user, users.id))
      .leftJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
      .leftJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
      .leftJoin(
        dbtCategoryTypesPoints,
        eq(dbtCategory.type, dbtCategoryTypesPoints.categoryType),
      )
      .groupBy(users.id, users.email, users.role, users.name, users.image)
      .orderBy(() =>
        desc(sql`COALESCE(SUM(${dbtCategoryTypesPoints.points}), 0)`),
      );

    const scoreData = await ctx.db
      .select({
        maxScore: sum(dbtCategoryTypesPoints.points),
      })
      .from(dbtNomination)
      .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
      .innerJoin(
        dbtCategoryTypesPoints,
        eq(dbtCategory.type, dbtCategoryTypesPoints.categoryType),
      )
      .where(dbtNomination.isWinner.getSQL());

    return { usersScores: usersData, maxScore: scoreData[0]?.maxScore ?? 0 };
  }),

  getUserNominations: publicProcedure
    .input(getCurrentUserVotesInputSchema)
    .query(async ({ ctx, input }) => {
      const winningNominations = await ctx.db
        .select({
          id: dbtNomination.id,
          categoryName: dbtCategory.name,
          winnerMovieName: dbtMovie.name,
          winnerReceiverName: dbtReceiver.name,
          winnerDescription: dbtNomination.description,
        })
        .from(dbtNomination)
        .where(eq(dbtNomination.isWinner, true))
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id));

      const votedNominations = await ctx.db
        .select({
          id: dbtNomination.id,
          categoryName: dbtCategory.name,
          votedMovieName: dbtMovie.name,
          votedReceiverName: dbtReceiver.name,
          votedDescription: dbtNomination.description,
          isWinner: dbtNomination.isWinner,
        })
        .from(dbtVote)
        .innerJoin(dbtNomination, eq(dbtVote.nomination, dbtNomination.id))
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .innerJoin(users, eq(users.username, input.username));

      const userNominations = votedNominations.map((voted) => {
        const winner = winningNominations.find(
          (win) => win.categoryName === voted.categoryName,
        );
        return {
          categoryName: voted.categoryName,
          votedMovieName: voted.votedMovieName,
          votedReceiverName: voted.votedReceiverName,
          votedDescription: voted.votedDescription,
          isWinner: voted?.isWinner ?? false,
          winnerMovieName: winner?.winnerMovieName ?? null,
          winnerReceiverName: winner?.winnerReceiverName ?? null,
          winnerDescription: winner?.winnerDescription ?? null,
        };
      });

      return userNominations;
    }),
});
