"use client";

import { useState } from "react";
import Image from "next/image";

interface BetSectionProps {
  nominations: {
    primaryNominee: string & {
      id: string;
      image: string | null;
      name: string | null;
      type: "movie" | "person" | null;
      slug: string | null;
      description: string | null;
      tagline: string | null;
      backdrop: string | null;
      letterboxd: string | null;
    };
    id: string;
    secondaryNominee:
      | (string & {
          id: string;
          image: string | null;
          name: string | null;
          type: "movie" | "person" | null;
          slug: string | null;
          description: string | null;
          tagline: string | null;
          backdrop: string | null;
          letterboxd: string | null;
        })
      | null;
    isWinner: boolean | null;
    category: string | null;
  }[];
}

export function BetSection({ nominations }: BetSectionProps) {
  const [selectedNomination, setSelectedNomination] = useState<
    (typeof nominations)[0] | null
  >(null);

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Selected info */}
      <div className="flex h-full w-2/3 flex-col justify-around">
        {selectedNomination ? (
          <div>
            {selectedNomination.secondaryNominee && (
              <p className="text-lg font-semibold">
                {selectedNomination.secondaryNominee.tagline}
              </p>
            )}
            <h2 className="py-4 text-4xl font-bold text-primary">
              {selectedNomination.primaryNominee.name}
            </h2>

            <div>
              {selectedNomination.primaryNominee.tagline && (
                <p className="pb-2 font-semibold">
                  {selectedNomination.primaryNominee.tagline?.toUpperCase()}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {selectedNomination.primaryNominee.description?.slice(0, 480)}
                {(selectedNomination.primaryNominee.description?.length ?? 0) >
                  480 && "..."}
              </p>
            </div>
          </div>
        ) : (
          <h2 className="py-4 text-2xl text-foreground">Select a nominee</h2>
        )}
      </div>

      {/* Posters */}
      <div className="flex gap-4 pb-12">
        {nominations.map((nomination) => (
          <div
            key={nomination.id}
            className={`relative aspect-[2/3] flex-1 cursor-pointer rounded-lg ${selectedNomination?.id === nomination.id ? "outline outline-primary" : "hover:outline hover:outline-foreground"}`}
            onClick={() => setSelectedNomination(nomination)}
          >
            <Image
              src={
                (nomination.secondaryNominee?.image ??
                  nomination.primaryNominee.image) ||
                "/images/placeholder.jpg"
              }
              alt={
                (nomination.secondaryNominee?.name ??
                  nomination.primaryNominee.name) ||
                "Movie poster"
              }
              fill
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
