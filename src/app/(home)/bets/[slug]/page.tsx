import { db } from "@/server/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhArrowLeft from "~icons/ph/arrow-left";
import PhArrowRight from "~icons/ph/arrow-right";

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

  return {
    current: categories[currentIndex],
    prev: currentIndex > 0 ? categories[currentIndex - 1] : null,
    next: currentIndex < categories.length - 1 ? categories[currentIndex + 1] : null,
  };
}

const BetPage = async ({ params }: { params: { slug: string } }) => {
  const { current, prev, next } = await getCategoryWithNavigation(params.slug);

  return (
    <div className="grid grid-cols-[300px_1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{current.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">{current.description}</p>
          
          <div className="flex justify-between">
            {prev ? (
              <Button variant="ghost" asChild>
                <Link href={`/bets/${prev.slug}`} className="flex items-center gap-2">
                  <PhArrowLeft className="w-4 h-4" />
                  {prev.name}
                </Link>
              </Button>
            ) : <div />}

            {next ? (
              <Button variant="ghost" asChild>
                <Link href={`/bets/${next.slug}`} className="flex items-center gap-2">
                  {next.name}
                  <PhArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : <div />}
          </div>
        </CardContent>
      </Card>

      <div>
        <>BETSSSS</>
      </div>
    </div>
  );
};

export default BetPage;