import { Badge } from "@/components/ui/badge";
import { CastVoteButton } from "@/components/votes/CastVoteButton";
import { type Nomination } from "@/types/nominations";
import Link from "next/link";
import PhArrowUpRight from "~icons/ph/arrow-up-right";

interface MovieInfoProps {
  nomination: Nomination | null;
}

export function MovieInfo({ nomination }: MovieInfoProps) {
  if (!nomination) {
    return (
      <h2 className="py-4 text-2xl text-foreground">Vote on a nominee!</h2>
    );
  }

  return (
    <div>
      <div className="pb-4">
        {nomination.description ? (
          <p className="text-lg">
            {nomination.receiver?.letterboxd ? (
              <Link
                className="hover:text-primary"
                href={
                  nomination.receiver?.letterboxd
                    ? nomination.receiver.letterboxd
                    : ""
                }
                target="_blank"
              >
                {nomination.receiver?.name && `${nomination.receiver.name} `}
              </Link>
            ) : (
              <span>
                {nomination.receiver?.name && `${nomination.receiver.name} `}
              </span>
            )}

            <span className="text-muted-foreground">
              {nomination.description}
            </span>
          </p>
        ) : (
          <p className="text-lg">Your vote is...</p>
        )}

        <h2 className="text-4xl font-bold text-primary">
          {nomination.movie.name}
        </h2>
      </div>

      <div>
        {nomination.movie.tagline && (
          <p className="pb-2 font-bold">
            {nomination.movie.tagline.toUpperCase()}
          </p>
        )}
        <p className="pb-2 text-sm text-muted-foreground">
          {nomination.movie.description?.slice(0, 360)}
          {(nomination.movie.description?.length ?? 0) > 360 && "..."}
        </p>

        {nomination.movie.letterboxd && (
          <Badge variant="outline" className="mt-2 hover:text-primary">
            <Link
              href={nomination.movie.letterboxd}
              target="_blank"
              className="flex items-center gap-1 p-1"
            >
              Letterboxd <PhArrowUpRight className="h-4 w-4" />
            </Link>
          </Badge>
        )}
        <CastVoteButton nominationId={nomination.id} categoryId={nomination.category}/>
      </div>
    </div>
  );
}
