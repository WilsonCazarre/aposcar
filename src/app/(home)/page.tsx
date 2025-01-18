import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/server/db";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import {
  dbtCategory,
  dbtMovie,
  dbtNomination,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { eq } from "drizzle-orm";
import { api } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  const winningNominations = await api.nominations.getWinningNominations();
  const { maxScore, usersScores } = await api.votes.getUserRankings();

  // TODO: No mobile adicionar um toggle entre a visão de ranking e updates.
  return (
    <div className="flex h-full flex-col justify-between gap-6 lg:flex-row">
      {winningNominations.length === 0 && (
        <div className="my-4 flex items-center justify-between rounded bg-primary p-4 lg:hidden">
          {/* TODO: Only show if user haven't voted in any nomination */}
          <p className="text-primary-foreground">
            Don't forget to cast your votes and share your predictions!
          </p>
          <Link
            className={buttonVariants({ variant: "outline" })}
            href="/votes"
          >
            Go vote
          </Link>
        </div>
      )}

      <div className="lg:w-2/3">
        <h2 className="pb-4 pl-4 text-2xl font-semibold">Ranking</h2>

        <ScrollArea
          className="flex flex-col gap-4 rounded-md border"
          style={{ maxHeight: "calc(100vh - 13rem)" }}
        >
          {usersScores.map((user) => (
            <div key={user.id}>
              <Link
                href={`/users/${user.id}`}
                className="flex w-full items-center gap-4 border-b border-secondary px-6 py-4 hover:bg-secondary"
              >
                <div className="text-xl font-bold">{user.position}º</div>
                <Avatar
                  className={
                    user.email === session?.user.email
                      ? "border-2 border-primary"
                      : ""
                  }
                >
                  <AvatarImage src={user.profilePic ?? ""} />
                  <AvatarFallback>
                    {user.username?.[0]?.toUpperCase() ?? "@"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-end justify-between">
                    <p className="font-sm">
                      {user.username}

                      {user.email === session?.user.email && (
                        <span className="pl-2 text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>

                    <p className="text-sm">{user.score} points</p>
                  </div>
                  <Progress
                    value={Number(user.score)}
                    max={Number(maxScore)}
                    className="h-2"
                  />
                </div>
              </Link>
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="flex flex-col lg:w-1/3">
        <h2 className="pb-4 pl-4 text-2xl font-semibold">Last updates</h2>

        {winningNominations.length === 0 && (
          <div>
            <div className="space-y-1 rounded border p-4">
              <h3 className="text-sm">
                When the premiation starts you'll see the winners right here!
              </h3>
            </div>

            {/* TODO: Only show if user haven't voted in any nomination */}
            <div className="my-4 hidden items-center justify-between rounded bg-primary p-4 lg:flex">
              <p className="text-primary-foreground">
                For now, don't forget to cast your votes and share your
                predictions!
              </p>
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/votes"
              >
                Go vote
              </Link>
            </div>
          </div>
        )}

        <ScrollArea
          className="flex flex-col gap-4 rounded-md border"
          style={{ maxHeight: "calc(100vh - 13rem)" }}
        >
          {winningNominations.map((nomination) => (
            <div key={nomination.id} className="space-y-1 border-b p-4">
              <div className="flex justify-between">
                <h3 className="text-sm">{nomination.categoryName}</h3>
                {nomination.isWinnerLastUpdate && (
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(nomination.isWinnerLastUpdate)} ago
                  </p>
                )}
              </div>

              <h2 className="text-lg font-semibold text-primary">
                {nomination.movie.name}
              </h2>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}
