import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Nomination } from "@/types/nominations";
import {
  dbtCategory,
  dbtMovie,
  dbtNomination,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { eq } from "drizzle-orm";

async function getWinningNominations(): Promise<{
  winningNominations: Nomination[];
}> {
  const winningNominations = await db
    .select({
      id: dbtNomination.id,
      description: dbtNomination.description,
      isWinner: dbtNomination.isWinner,
      category: dbtNomination.category,
      categoryName: dbtCategory.name,
      movie: {
        id: dbtMovie.id,
        poster: dbtMovie.poster,
        name: dbtMovie.name,
        slug: dbtMovie.slug,
        description: dbtMovie.description,
        tagline: dbtMovie.tagline,
        backdrop: dbtMovie.backdrop,
        letterboxd: dbtMovie.letterboxd,
      },
      receiver: {
        id: dbtReceiver.id,
        name: dbtReceiver.name,
        image: dbtReceiver.image,
        slug: dbtReceiver.slug,
        letterboxd: dbtReceiver.letterboxd,
      },
    })
    .from(dbtNomination)
    .where(eq(dbtNomination.isWinner, true))
    .innerJoin(dbtCategory, eq(dbtNomination.category, dbtCategory.id))
    .innerJoin(dbtMovie, eq(dbtNomination.movie, dbtMovie.id))
    .leftJoin(dbtReceiver, eq(dbtNomination.receiver, dbtReceiver.id));

  console.log(winningNominations);

  return {
    winningNominations,
  };
}

export default async function Home() {
  const session = await auth();
  const allUsers = await db.select().from(users).orderBy(users.name);

  const { winningNominations } = await getWinningNominations();

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
          {allUsers.map((user) => (
            <div key={user.id}>
              <Link
                href={`/users/${user.id}`}
                className="flex w-full items-center gap-4 border-b border-secondary px-6 py-4 hover:bg-secondary"
              >
                <div className="text-xl font-bold">1º</div>
                <Avatar
                  className={
                    user.email === session?.user.email
                      ? "border-2 border-primary"
                      : ""
                  }
                >
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback>
                    {user.name?.[0]?.toUpperCase() ?? "@"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex w-full flex-col gap-2">
                  <div className="flex w-full items-end justify-between">
                    <p className="font-sm">
                      {user.name}

                      {user.email === session?.user.email && (
                        <span className="pl-2 text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>

                    <p className="text-sm">69 points</p>
                  </div>
                  <Progress value={69} max={100} className="h-2" />
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
              <h3 className="text-sm">{nomination.categoryName}</h3>
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
