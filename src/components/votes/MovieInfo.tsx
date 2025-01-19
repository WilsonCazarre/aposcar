"use client";
import { SocialMediaBadge } from "@/components/SocialMediaBadge";
import { CastVoteButton } from "@/components/votes/CastVoteButton";
import { type FullNomination } from "@/server/api/routers/nominations";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface MovieInfoProps {
  nomination: FullNomination | null;
}

export function MovieInfo({ nomination }: MovieInfoProps) {
  const { slug: categorySlug } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [charLimit, setCharLimit] = useState(180);

  useEffect(() => {
    const handleResize = () => {
      setCharLimit(window.innerWidth >= 1024 ? 220 : 180);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!nomination) {
    return (
      <h2 className="py-4 text-2xl text-foreground">{"What's your vote?"}</h2>
    );
  }

  const description = nomination.movie.description ?? "";
  const truncatedDescription = description.slice(0, charLimit);

  return (
    <div>
      {/* Cabeçalho */}
      <div className="pb-4">
        {/* Pré título (Your vote is... / Descrição da nomination) */}
        {nomination.description ? (
          <p className="text-sm lg:text-lg">
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
          <p className="text-sm lg:text-lg">Your vote is...</p>
        )}

        {/* Título do filme */}
        <h2 className="text-xl font-bold text-primary lg:text-3xl">
          {nomination.movie.name}
        </h2>
      </div>

      {/* Corpo */}
      <div>
        {/* Tagline */}
        {nomination.movie.tagline && (
          <p className="pb-2 text-sm font-bold">
            {nomination.movie.tagline.toUpperCase()}
          </p>
        )}

        {/* Descrição */}
        <p className="pb-2 text-sm text-muted-foreground">
          {showFullDescription ? description : truncatedDescription}
          {description.length > charLimit && (
            <span
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="cursor-pointer text-foreground hover:text-primary"
            >
              {showFullDescription ? " See less" : "... See more"}
            </span>
          )}
        </p>
      </div>

      {/* Ações */}
      <div className="flex w-full">
        {/* Links */}
        <div>
          {nomination.movie.letterboxd && (
            <SocialMediaBadge
              text="Letterboxd"
              url={nomination.movie.letterboxd}
            />
          )}
        </div>
      </div>
    </div>
  );
}
