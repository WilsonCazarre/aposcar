import { type Nomination } from "@/types/nominations";

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
    <div className="text-end">
      <div className="py-4">
        {nomination.description ? (
          <p className="text-lg">
            <span>
              {nomination.receiver?.name && `${nomination.receiver.name} `}
            </span>
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
        <p className="text-sm text-muted-foreground">
          {nomination.movie.description?.slice(0, 480)}
          {(nomination.movie.description?.length ?? 0) > 480 && "..."}
        </p>
      </div>
    </div>
  );
}
