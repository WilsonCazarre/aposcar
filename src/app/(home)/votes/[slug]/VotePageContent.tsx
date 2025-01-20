"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import PhArrowLeft from "~icons/ph/arrow-left";
import PhArrowRight from "~icons/ph/arrow-right";
import { useState } from "react";
import { MovieInfo } from "@/components/votes/MovieInfo";
import { MovieSelector } from "@/components/votes/MovieSelector";
import { CategoryCard } from "@/components/votes/CategoryCard";
import Image from "next/image";
import { type CategoryWithNavigation } from "@/server/api/routers/nominations";
import { type Unpacked } from "@/lib/utils";
import { CategoriesList } from "@/components/votes/CategoriesList";
import { type Category } from "@/server/api/zod/schema";
import { VoteNavigator } from "@/components/votes/VoteNavigator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type Nomination = Unpacked<CategoryWithNavigation["nominations"]>;

interface Props extends CategoryWithNavigation {
  categories: Category[];
}

export function VotePageContent({
  currentCategory,
  prevCategory,
  nextCategory,
  categoryPoints,
  nominations,
  categories,
}: Props) {
  const [selectedNomination, setSelectedNomination] =
    useState<Nomination | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null,
  );
  const router = useRouter();

  const handleNavigationAttempt = (slug: string) => {
    const hasUserVote = nominations.some((nomination) => nomination.isUserVote);
    if (!hasUserVote) {
      setShowDialog(true);
      setPendingNavigation(slug);
    } else {
      router.push(`/votes/${slug}`);
    }
  };

  return (
    <div className="relative">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You didn't confirm your vote!</DialogTitle>
            <DialogDescription>
              Are you sure you want to leave without voting in this category?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (pendingNavigation) {
                  router.push(`/votes/${pendingNavigation}`);
                }
              }}
            >
              Leave anyway
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex h-full flex-col pb-8 lg:flex-row lg:gap-16 lg:pb-0">
        <div className="flex flex-col gap-4 pb-4 lg:h-full lg:w-1/2 lg:justify-between lg:p-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-1 justify-between">
              <Button
                variant="outline"
                asChild
                className="h-8 w-8 p-0 lg:h-12 lg:w-12"
              >
                <Link
                  href={`/votes/${prevCategory?.slug}`}     
                >
                  <PhArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
                </Link>
              </Button>

              <CategoriesList
                categories={categories}
                onNavigate={handleNavigationAttempt}
              />

              <Button
                variant="outline"
                asChild
                className="h-8 w-8 p-0 lg:h-12 lg:w-12"
                onClick={() =>
                  handleNavigationAttempt(nextCategory?.slug ?? "")
                }
              >
                <div>
                  <PhArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                </div>
              </Button>
            </div>

            <CategoryCard
              name={currentCategory.name}
              description={currentCategory.description}
              points={categoryPoints}
            />
          </div>

          <MovieSelector
            categorySlug={currentCategory.slug}
            selectedId={selectedNomination?.id ?? null}
            nextCategorySlug={nextCategory?.slug}
            onSelect={setSelectedNomination}
          />
        </div>

        <div className="lg:w-1/2">
          <div className="fixed right-0 top-0 hidden aspect-[16/9] w-1/2 lg:block">
            {selectedNomination?.movie.backdrop && (
              <Image
                src={selectedNomination.movie.backdrop}
                alt="Movie backdrop"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-l from-transparent to-background" />
          </div>

          <div className="lg:relative lg:z-10 lg:[&>*]:pt-[calc(100%*5/16)]">
            <MovieInfo nomination={selectedNomination} />
          </div>
        </div>
      </div>
      <div className="fixed bottom-14 left-0 right-0 hidden lg:block">
        <VoteNavigator categories={categories} />
      </div>
    </div>
  );
}
