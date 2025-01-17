import Image from "next/image";
import { type Nomination } from "@/types/nominations";

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
    <div className="flex gap-4 pb-10">
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
  );
}
