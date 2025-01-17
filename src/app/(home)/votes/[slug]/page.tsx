import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent";
import { type Category } from "@/types/categories";
import { type Nomination } from "@/types/nominations";
import {
  dbtCategory,
  dbtMovie,
  dbtNomination,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { eq } from "drizzle-orm";
import { api } from "@/trpc/client";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await db.query.dbtCategory.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
};

async function getCategoryWithNavigation(slug: string): Promise<{
  currentCategory: Category;
  prevCategory: Category;
  nextCategory: Category;
  categoryPoints: number | null | undefined;
  nominations: Nomination[];
  categories: Category[];
}> {
  const categories = await db.query.dbtCategory.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  const currentIndex = categories.findIndex((c) => c.slug === slug);

  if (currentIndex === -1) return notFound();

  const current = categories[currentIndex]!;

  const points = current.type
    ? await db.query.dbtCategoryTypesPoints.findFirst({
        where: (points, { eq }) => eq(points.categoryType, current.type),
      })
    : null;

  const nominations = await db
    .select({
      id: dbtNomination.id,
      description: dbtNomination.description,
      isWinner: dbtNomination.isWinner,
      category: dbtNomination.category,
      categoryName: dbtCategory.name,
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
    .where(eq(dbtNomination.category, current.id))
    .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
    .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
    .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id));

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
    categoryPoints: points?.points,
    nominations,
    categories,
  };
}

const VotePage = async ({ params }: { params: { slug: string } }) => {
  const data = await getCategoryWithNavigation(params.slug);

  if (!data.currentCategory) return notFound();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotePageContent {...data} />
    </Suspense>
  );
};

export default VotePage;
