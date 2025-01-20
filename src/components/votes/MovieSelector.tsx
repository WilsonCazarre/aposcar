"use client";

import React from "react";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type FullNomination } from "@/server/api/routers/nominations";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { CastVoteButton } from "@/components/votes/CastVoteButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MovieSelectorProps {
  selectedId: string | null;
  categorySlug: string;
  nextCategorySlug?: string;

  onSelect: (nomination: FullNomination) => void;
}

export function MovieSelector({
  selectedId,
  onSelect,
  categorySlug,
  nextCategorySlug,
}: MovieSelectorProps) {
  const { data } = api.nominations.getCategoryWithNavigation.useQuery({
    categorySlug,
  });
  const nominations = data?.nominations;

  const SelectedBadge = () => (
    <div className="absolute right-0 z-50 rounded-bl-lg bg-primary p-1 text-xs font-semibold text-primary-foreground">
      Your vote
    </div>
  );

  return (
    <>
      {/* Mobile view */}
      <div className="lg:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex flex-row gap-4 p-2">
            {nominations?.map((nomination) => (
              <div key={nomination.id} className="relative shrink-0">
                {nomination.isUserVote && <SelectedBadge />}
                <Image
                  src={
                    nomination.receiver?.image ??
                    nomination.movie.poster ??
                    "/images/placeholder.jpg"
                  }
                  alt={
                    nomination.receiver?.name ??
                    nomination.movie.name ??
                    "Movie poster"
                  }
                  width={120}
                  height={180}
                  className={cn(
                    "h-full cursor-pointer rounded-md object-cover outline",
                    nomination.isUserVote && "outline-primary",
                    selectedId === nomination.id && "outline-foreground",
                  )}
                  onClick={() => onSelect(nomination)}
                />
                {selectedId === nomination.id && !nomination.isUserVote && (
                  <CastVoteButton
                    nominationId={nomination.id}
                    categorySlug={categorySlug}
                    nextCategorySlug={nextCategorySlug}
                  />
                )}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop view */}

      <div className="hidden w-full gap-2 p-2 lg:flex">
        {nominations?.map((nomination) => (
          <div
            key={nomination.id}
            className={cn(
              `relative aspect-[2/3] flex-1 cursor-pointer rounded-md outline outline-transparent transition-all`,
              nomination.isUserVote && "outline-primary",
              selectedId === nomination.id && "outline-foreground",
            )}
            onClick={() => onSelect(nomination)}
          >
            {nomination.isUserVote && <SelectedBadge />}
            <Image
              src={
                nomination.receiver?.image ??
                nomination.movie.poster ??
                "/images/placeholder.jpg"
              }
              alt={
                nomination.receiver?.name ??
                nomination.movie.name ??
                "Movie poster"
              }
              fill
              className="rounded-md object-cover"
            />
            {selectedId === nomination.id && !nomination.isUserVote && (
              <CastVoteButton
                nominationId={nomination.id}
                categorySlug={categorySlug}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}
