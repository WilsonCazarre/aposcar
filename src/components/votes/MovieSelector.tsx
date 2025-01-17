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
  return (
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
            className={`cursor-pointer rounded-md object-cover ${
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
  );
}
