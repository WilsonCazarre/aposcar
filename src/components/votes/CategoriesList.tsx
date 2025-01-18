import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/types/categories";
import Link from "next/link";

export function CategoriesList({ categories }: { categories: Category[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-8 text-xs lg:h-12 lg:text-base">
          See all
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] ">
        <DialogHeader>
          <DialogTitle>All Categories</DialogTitle>
        </DialogHeader>
        <ScrollArea
          className="flex flex-col gap-2 rounded-md border"
          style={{ maxHeight: "calc(100vh - 14rem)" }}
        >
          {categories.map((category) => (
            <div className="flex flex-col" key={category.id}>
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
      </DialogContent>
    </Dialog>
  );
}
