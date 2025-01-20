import { SocialMediaBadge } from "@/components/SocialMediaBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { users } from "@/server/db/schema/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import PhTrophy from "~icons/ph/trophy";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/server/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const UserPage = async ({ params }: { params: { username: string } }) => {
  const session = await auth();

  const { maxScore, usersScores } = await api.votes.getUserRankings();

  const currentUser = usersScores.find(
    (user) => user.username === params.username,
  );

  if (!currentUser) return notFound();

  const { userNominations, userData } = await api.votes.getUserProfile(
    params.username,
  );

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* User info */}
      <div className="flex flex-col lg:w-1/3">
        {/* Backdrop */}
        {userData?.backdrop && (
          <div className="absolute left-0 top-0 block aspect-[16/9] w-full lg:w-1/3">
            <Image
              src={userData?.backdrop ?? "/images/backdrop-placeholder.png"}
              alt="Favorite movie backdrop"
              fill
              className="object-cover"
            />

            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
            <div className="absolute inset-y-0 right-0 lg:w-1/4 lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
          </div>
        )}

        <div
          className={`w-full space-y-4 ${userData?.backdrop ? "relative z-10 pt-[calc(100%*5/16)]" : ""}`}
        >
          {/* Avatar & username */}
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Avatar
                className={`h-16 w-16 lg:h-24 lg:w-24 ${
                  userData?.username === session?.user.username
                    ? "border-2 border-primary"
                    : ""
                }`}
              >
                <AvatarImage src={userData?.profilePic ?? ""} />
                <AvatarFallback className="text-2xl font-bold lg:text-4xl">
                  {userData?.username?.[0]?.toUpperCase() ?? "@"}
                </AvatarFallback>
              </Avatar>
              <h1 className="pl-4 pt-8 text-2xl font-bold">
                {userData?.username}
              </h1>
            </div>

            {userData?.id === session?.user.id && (
              <Link href={`/users/${userData?.username}/edit`}>
                <Button variant="outline" size="sm">
                  Edit profile
                </Button>
              </Link>
            )}
          </div>

          {/* Social medias */}
          <div className="flex flex-wrap gap-2 py-2">
            {userData?.letterboxdUsername && (
              <SocialMediaBadge
                url={`https://letterboxd.com/` + userData.letterboxdUsername}
                text="Letterboxd"
              />
            )}
            {userData?.twitterUsername && (
              <SocialMediaBadge
                url={`https://x.com/` + userData.twitterUsername}
                text="Twitter"
              />
            )}
            {userData?.bskyUsername && (
              <SocialMediaBadge
                url={`https://bsky.app/profile/` + userData.bskyUsername}
                text="Bluesky"
              />
            )}
            {userData?.githubUsername && (
              <SocialMediaBadge
                url={`https://github.com/` + userData.githubUsername}
                text="Github"
              />
            )}
          </div>

          {/* General Info */}
          <div className="w-full space-y-4 py-2">
            <div className="flex w-full gap-4">
              <div className="w-1/2 rounded-sm border px-4 py-2">
                <p className="text-sm text-muted-foreground">Total score:</p>
                <div className="flex items-end justify-between">
                  <div className="text-xl font-bold">
                    {currentUser.score} points
                  </div>
                  <div className="text-muted-foreground">/ {maxScore}</div>
                </div>
              </div>

              <div className="w-1/2 rounded-sm border px-4 py-2">
                <p className="text-sm text-muted-foreground">Posição:</p>
                <p className="text-xl font-bold">{currentUser.position}º</p>
              </div>
            </div>

            {userData?.favoriteMovie && (
              <div className="w-full rounded-sm border px-4 py-2">
                <p className="text-sm text-muted-foreground">
                  Favorite movie of the season:
                </p>
                <p className="text-lg font-bold">{userData.favoriteMovie}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Votes table */}
      <div className="py-2 lg:w-2/3 lg:p-0">
        <h2 className="pb-4 pl-4 text-2xl font-bold">Your votes</h2>

        {/* TODO: Apply this later https://github.com/shadcn-ui/ui/issues/1151 */}
        <ScrollArea
          className="flex flex-col"
          style={{ maxHeight: "calc(100vh - 16rem)" }}
        >
          <Table>
            <TableHeader>
              <TableRow className="font-bold">
                <TableHead>Category</TableHead>
                <TableHead>Your Vote</TableHead>
                <TableHead>Winner</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {userNominations.map((nomination) => (
                <TableRow key={nomination.categoryName}>
                  <TableCell className="font-bold">
                    {nomination.categoryName}
                  </TableCell>
                  <TableCell>
                    {nomination.votedReceiverName ? (
                      <span
                        className={nomination.isWinner ? "text-primary" : ""}
                      >
                        {nomination.votedReceiverName}
                        {" ("}
                        {nomination.votedMovieName}
                        {") "}
                      </span>
                    ) : (
                      (nomination.votedMovieName ?? (
                        <span className="text-sm font-normal text-muted-foreground">
                          You haven't voted in this category!
                        </span>
                      ))
                    )}
                  </TableCell>
                  <TableCell>
                    {nomination.isWinner ? (
                      <PhTrophy className="text-primary" />
                    ) : nomination.winnerReceiverName ? (
                      <span>
                        {nomination.winnerReceiverName}
                        {" ("}
                        {nomination.winnerMovieName}
                        {") "}
                      </span>
                    ) : (
                      (nomination.votedMovieName ?? (
                        <span className="text-sm text-muted-foreground">-</span>
                      ))
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default UserPage;
