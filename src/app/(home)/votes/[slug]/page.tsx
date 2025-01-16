import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await db.query.dbtCategory.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
};

async function getCategoryWithNavigation(slug: string) {
  const categories = await db.query.dbtCategory.findMany({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  const currentIndex = categories.findIndex((c) => c.slug === slug);

  if (currentIndex === -1) return notFound();

  const current = categories[currentIndex];
  const points = await db.query.dbtCategoryTypesPoints.findFirst({
    where: (points, { eq }) => eq(points.categoryType, current?.type || ""),
  });

  const nominations = await db.query.dbtNomination.findMany({
    where: (nomination, { eq }) => eq(nomination.category, current?.id || ""),
    with: {
      movie: true,
      receiver: true,
    },
  });

  return {
    currentCategory: categories[currentIndex],
    prevCategory:
      currentIndex > 0
        ? categories[currentIndex - 1]
        : categories[categories.length - 1],
    nextCategory:
      currentIndex < categories.length - 1
        ? categories[currentIndex + 1]
        : categories[0],
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
