import { db } from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhArrowUp from "~icons/ph/arrow-up";
import PhArrowDown from "~icons/ph/arrow-down";
import { BetSection } from "@/components/BetSection";

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
  };
}

const BetPage = async ({ params }: { params: { slug: string } }) => {
  const {
    currentCategory,
    prevCategory,
    nextCategory,
    categoryPoints,
    nominations,
  } = await getCategoryWithNavigation(params.slug);

  if (!currentCategory) return notFound();

  return (
    <div className="flex h-full justify-between gap-12">
      {/* Bet section */}
      <div className="w-2/3">
        <BetSection nominations={nominations} />
      </div>

      {/* Navigation section */}
      <div className="flex w-1/3 flex-col justify-center gap-4 pb-16">
        {/* Back button */}
        <div className="self-end">
          <Button variant="outline" asChild className="h-12 w-12 p-0">
            <Link href={`/bets/${prevCategory?.slug}`}>
              <PhArrowUp className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Category card */}
        <Card>
          <CardHeader>
            {categoryPoints && (
              <span className="text-sm text-muted-foreground">
                ({categoryPoints} points)
              </span>
            )}
            <CardTitle>{currentCategory.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              {currentCategory.description}
            </p>
          </CardContent>
        </Card>

        {/* Next button */}
        <div className="self-end">
          <Button variant="outline" asChild className="h-12 w-12 p-0">
            <Link href={`/bets/${nextCategory?.slug}`}>
              <PhArrowDown className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BetPage;
