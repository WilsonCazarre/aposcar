import { type Unpacked } from "@/lib/utils";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import {
  categorySchema,
  moviesSchema,
  nominationSchema,
  receiverSchema,
} from "@/server/api/zod/schema";
import {
  dbtCategory,
  dbtCategoryTypesPoints,
  dbtMovie,
  dbtNomination,
  dbtReceiver,
  dbtVote,
} from "@/server/db/schema/aposcar";
import { TRPCError } from "@trpc/server";
import { eq, isNotNull, and } from "drizzle-orm";
import { z } from "zod";

const getCategoryInputSchema = z.object({
  categorySlug: z.string(),
});

const getCategoryWithNavigationSchema = z.object({
  currentCategory: categorySchema,
  prevCategory: categorySchema,
  nextCategory: categorySchema,
  categoryPoints: z.number(),
  nominations: nominationSchema
    .extend({
      movie: moviesSchema,
      receiver: receiverSchema.nullable(),
      isUserVote: z.boolean()
    })
    .array(),
});

export type CategoryWithNavigation = z.infer<
  typeof getCategoryWithNavigationSchema
>;

export type FullNomination = Unpacked<CategoryWithNavigation["nominations"]>

export const nominationsRouter = createTRPCRouter({
  getCategoryWithNavigation: protectedProcedure
    .input(getCategoryInputSchema)
    .output(getCategoryWithNavigationSchema)
    .query(async ({ ctx, input }) => {
      const nominations = await ctx.db
        .select({
          id: dbtNomination.id,
          description: dbtNomination.description,
          isWinner: dbtNomination.isWinner,
          category: dbtNomination.category,
          categoryName: dbtCategory.name,
          isUserVote: isNotNull(dbtVote.user).as<boolean>("isUserVote"),
          movie: {
            id: dbtMovie.id,
            poster: dbtMovie.poster,
            name: dbtMovie.name,
            slug: dbtMovie.slug,
            description: dbtMovie.description,
            tagline: dbtMovie.tagline,
            backdrop: dbtMovie.backdrop,
            letterboxd: dbtMovie.letterboxd,
          },
          receiver: {
            id: dbtReceiver.id,
            name: dbtReceiver.name,
            image: dbtReceiver.image,
            slug: dbtReceiver.slug,
            letterboxd: dbtReceiver.letterboxd,
          },
        })
        .from(dbtNomination)
        .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
        .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
        .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id))
        .leftJoin(
          dbtVote,
          and(
            eq(dbtVote.nomination, dbtNomination.id),
            eq(dbtVote.user, ctx.session.user.id),
          ),
        )
        .where(eq(dbtCategory.slug, input.categorySlug));

      if (nominations.length < 1) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Category not found",
        });
      }

      const categories = await ctx.db
        .select({
          id: dbtCategory.id,
          description: dbtCategory.description,
          slug: dbtCategory.slug,
          name: dbtCategory.name,
          type: dbtCategory.type,
        })
        .from(dbtCategory);

      const currentIndex = categories.findIndex(
        (c) => c.slug === input.categorySlug,
      );

      const current = categories[currentIndex]!;

      const categoryPoints = (
        await ctx.db
          .select({
            categoryType: dbtCategoryTypesPoints.categoryType,
            points: dbtCategoryTypesPoints.points,
          })
          .from(dbtCategoryTypesPoints)
          .where(eq(dbtCategoryTypesPoints.categoryType, current.type))
      ).at(0)?.points;

      if (!categoryPoints) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Category has configured points",
        });
      }
      // const points = current.type
      //   ? await db.query.dbtCategoryTypesPoints.findFirst({
      //       where: (points, { eq }) => eq(points.categoryType, current.type),
      //     })
      //   : null;

      return {
        currentCategory: current,
        prevCategory:
          currentIndex > 0
            ? categories[currentIndex - 1]!
            : categories[categories.length - 1]!,
        nextCategory:
          currentIndex < categories.length - 1
            ? categories[currentIndex + 1]!
            : categories[0]!,
        categoryPoints,
        nominations: nominations,
      };
    }),
  getCategories: publicProcedure
    .output(categorySchema.array())
    .query(async ({ ctx }) => {
      return await ctx.db.select().from(dbtCategory);
    }),
});
