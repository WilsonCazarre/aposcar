"use client";

import { useState } from "react";
import { type Nomination } from "@/types/nominations";
import { MovieSelector } from "./MovieSelector";
import { MovieInfo } from "./MovieInfo";

interface BetSectionProps {
  nominations: Nomination[];
}

export function BetSection({ nominations }: BetSectionProps) {
  const [selectedNomination, setSelectedNomination] =
    useState<Nomination | null>(null);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="flex h-full w-2/3 flex-col justify-around">
        <MovieInfo nomination={selectedNomination} />
      </div>
      <MovieSelector
        nominations={nominations}
        selectedId={selectedNomination?.id ?? null}
        onSelect={setSelectedNomination}
      />
    </div>
  );
}
