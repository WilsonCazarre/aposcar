"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import PhArrowLeft from "~icons/ph/arrow-left";
import PhArrowRight from "~icons/ph/arrow-right";
import type { Category } from "@/types/categories";
import type { Nomination } from "@/types/nominations";
import { useState } from "react";
import { MovieInfo } from "@/components/votes/MovieInfo";
import { MovieSelector } from "@/components/votes/MovieSelector";
import { CategoriesList } from "@/components/votes/CategoriesList";
import { CategoryCard } from "@/components/votes/CategoryCard";
import { api } from "@/trpc/react";

interface VotePageProps {
  currentCategory: Category;
  prevCategory: Category;
  nextCategory: Category;
  categoryPoints: number | undefined | null;
  nominations: Nomination[];
  categories: Category[];
}

export function VotePageContent({
  currentCategory,
  prevCategory,
  nextCategory,
  categoryPoints,
  nominations,
  categories,
}: VotePageProps) {
  const [selectedNomination, setSelectedNomination] =
    useState<Nomination | null>(null);

  const { data } = api.votes.getVotes.useQuery();

  return (
    <div className="flex h-full flex-col lg:flex-row lg:gap-16">
      <div className="flex flex-col justify-center gap-4 pb-4 lg:w-1/2 lg:pb-16">
        <div className="flex justify-between">
          <Button
            variant="outline"
            asChild
            className="h-8 w-8 p-0 lg:h-12 lg:w-12"
          >
            <Link href={`/votes/${prevCategory?.slug}`}>
              <PhArrowLeft className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
          </Button>

          <CategoriesList categories={categories} />

          <Button
            variant="outline"
            asChild
            className="h-8 w-8 p-0 lg:h-12 lg:w-12"
          >
            <Link href={`/votes/${nextCategory?.slug}`}>
              <PhArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
            </Link>
          </Button>
        </div>

        <CategoryCard
          name={currentCategory.name}
          description={currentCategory.description}
          points={categoryPoints}
        />

        <MovieSelector
          nominations={nominations}
          selectedId={selectedNomination?.id ?? null}
          onSelect={setSelectedNomination}
        />
      </div>

      <div className="lg:w-1/2">
        <div className="pt-4 lg:h-full lg:w-3/4 lg:pb-8 lg:pt-0">
          <MovieInfo nomination={selectedNomination} />
        </div>
      </div>
    </div>
  );
}
