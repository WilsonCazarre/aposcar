import { db } from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhArrowUp from "~icons/ph/arrow-up";
import PhArrowDown from "~icons/ph/arrow-down";

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
    where: (points, { eq }) => eq(points.categoryType, current?.type),
  });

  return {
    current: categories[currentIndex],
    prev: currentIndex > 0 ? categories[currentIndex - 1] : categories[categories.length - 1],
    next: currentIndex < categories.length - 1 ? categories[currentIndex + 1] : categories[0],
    points: points,
  };
}

const BetPage = async ({ params }: { params: { slug: string } }) => {
  const { current, prev, next, points } = await getCategoryWithNavigation(params.slug);
  // const categoryPoints = await getPointsForCategory(current?.type);
  
  if (!current) return notFound();

  return (
    <div className="flex justify-between gap-4 h-full">
      <div className="w-1/4 flex flex-col justify-center gap-4">

        <div>
          <Button variant="outline" asChild className="w-12 h-12 p-0">
            <Link href={`/bets/${prev?.slug}`}>
              <PhArrowUp className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            {points && (
                <span className="text-sm text-muted-foreground">({points.points} points)</span>
            )}
            <CardTitle>{current.name}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">{current.description}</p>
          </CardContent>
        </Card>

        <div>
          <Button variant="outline" asChild className="w-12 h-12 p-0">
            <Link href={`/bets/${next?.slug}`}>
              <PhArrowDown className="w-5 h-5" />
            </Link>
          </Button>
        </div>

      </div>

      <div className="w-3/4">
        <>BETSSSS</>
      </div>
    </div>
  );
};

export default BetPage;