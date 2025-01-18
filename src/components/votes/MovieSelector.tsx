import React from "react";
import Image from "next/image";
import { type Nomination } from "@/types/nominations";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MovieSelectorProps {
  nominations: Nomination[];
  selectedId: string | null;
  onSelect: (nomination: Nomination) => void;
}

export function MovieSelector({
  nominations,
  selectedId,
  onSelect,
}: MovieSelectorProps) {
  console.log(nominations);
  return (
    <>
      {/* Mobile view */}
      <div className="lg:hidden">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex flex-row gap-4 p-2">
            {nominations.map((nomination) => (
              <Image
                key={nomination.id}
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
                className={`shrink-0 cursor-pointer rounded-md object-cover ${
                  selectedId === nomination.id
                    ? "outline outline-primary"
                    : "hover:outline hover:outline-foreground"
                }`}
                onClick={() => onSelect(nomination)}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Desktop view */}
      <div className="hidden w-full gap-2 p-2 lg:flex">
        {nominations.map((nomination) => (
          <div
            key={nomination.id}
            className={`relative aspect-[2/3] flex-1 cursor-pointer rounded-md ${
              selectedId === nomination.id
                ? "outline outline-primary"
                : "hover:outline hover:outline-foreground"
            }`}
            onClick={() => onSelect(nomination)}
          >
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
          </div>
        ))}
      </div>
    </>
  );
}
