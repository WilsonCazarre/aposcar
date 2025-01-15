"use client";

import { useState } from "react";
import Image from "next/image";

interface BetSectionProps {
  nominations: {
    movie: string & {
      id: string;
      poster: string | null;
      name: string | null;
      slug: string | null;
      description: string | null;
      tagline: string | null;
      backdrop: string | null;
      letterboxd: string | null;
    };
    id: string;
    receiver:
      | (string & {
          id: string;
          slug: string | null;
          image: string | null;
          name: string | null;
          letterboxd: string | null;
        })
      | null;
    isWinner: boolean | null;
    category: string | null;
    description: string | null;
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
            {selectedNomination.description && (
              <p className="text-lg">
                <span className="font-bold">
                  {selectedNomination.receiver?.name ? selectedNomination.receiver.name + " " : ""}
                </span>
                {selectedNomination.description}
              </p>
            )}
            <h2 className="py-4 text-4xl font-bold text-primary">
              {selectedNomination.movie.name}
            </h2>

            <div>
              {selectedNomination.movie.tagline && (
                <p className="pb-2 font-semibold">
                  {selectedNomination.movie.tagline?.toUpperCase()}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {selectedNomination.movie.description?.slice(0, 480)}
                {(selectedNomination.movie.description?.length ?? 0) > 480 &&
                  "..."}
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
                (nomination.receiver?.image ?? nomination.movie.poster) ||
                "/images/placeholder.jpg"
              }
              alt={
                (nomination.receiver?.name ?? nomination.movie.name) ||
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
