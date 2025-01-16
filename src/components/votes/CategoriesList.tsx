import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types/categories";
import Link from "next/link";

export function CategoriesList({ categories }: { categories: Category[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="flex flex-col gap-2 rounded-md border"
          style={{ maxHeight: "calc(100vh - 24rem)" }}
        >
          {categories.map((category) => (
            <div className="flex w-full flex-col" key={category.id}>
              <Link
                key={category.id}
                href={`/votes/${category.slug}`}
                className="border border-secondary px-4 py-2 hover:bg-secondary"
              >
                {category.name}
              </Link>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
