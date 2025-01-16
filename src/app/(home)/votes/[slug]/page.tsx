import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent";
import { Category } from "@/types/categories";
import { Nomination } from "@/types/nominations";

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

  const nominationsData = await db.query.dbtNomination.findMany({
    where: (nomination, { eq }) => eq(nomination.category, current.id),
    with: {
      movie: true,
      receiver: true,
    },
  });

  const nominations: Nomination[] = nominationsData.map((nom) => {
    const movieData =
      typeof nom.movie === "string"
        ? {
            id: nom.movie,
            poster: null,
            name: null,
            slug: null,
            description: null,
            tagline: null,
            backdrop: null,
            letterboxd: null,
          }
        : nom.movie;

    const receiverData = nom.receiver
      ? typeof nom.receiver === "string"
        ? {
            id: nom.receiver,
            name: null,
            image: null,
            slug: null,
            letterboxd: null,
          }
        : nom.receiver
      : null;
    
    return {
      id: nom.id,
      description: nom.description,
      isWinner: nom.isWinner,
      category: nom.category,
      movie: movieData,
      receiver: receiverData,
    };
  });

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
