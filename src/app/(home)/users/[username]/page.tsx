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

const UserPage = async ({ params }: { params: { username: string } }) => {
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
        <div className="fixed left-0 top-0 block aspect-[16/9] w-full lg:w-1/3">
          <Image
            src={userData?.backdrop ?? "/images/backdrop-placeholder.png"}
            alt="Favorite movie backdrop"
            fill
            className="object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
          <div className="absolute inset-y-0 right-0 lg:w-1/4 lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
        </div>

        <div className="relative z-10 space-y-4 pt-[calc(100%*5/16)]">
          {/* Avatar & username */}
          <div className="flex items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={userData?.profilePic ?? ""} />
              <AvatarFallback className="text-4xl font-bold">
                {userData?.username?.[0]?.toUpperCase() ?? "@"}
              </AvatarFallback>
            </Avatar>
            <h1 className="pt-4 text-2xl font-bold">{userData?.username}</h1>
          </div>

          {/* Social medias */}
          <div className="flex flex-wrap gap-2">
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
          <div>
            {userData?.favoriteMovie && (
              <div>
                <p className="text-sm text-muted-foreground">Favorite movie of the season:</p>
                <p className="text-lg text-primary">{userData.favoriteMovie}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Votes table */}
      <div className="lg:w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Your Vote</TableHead>
              <TableHead>Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userNominations.map((nomination) => (
              <TableRow key={nomination.categoryName}>
                <TableCell>{nomination.categoryName}</TableCell>
                <TableCell>
                  {nomination.votedReceiverName ? (
                    <>
                      {nomination.votedReceiverName}{" "}
                      {nomination.votedDescription} {nomination.votedMovieName}
                    </>
                  ) : (
                    nomination.votedMovieName
                  )}
                </TableCell>
                <TableCell>
                  {nomination.isWinner ? (
                    <PhTrophy className="text-primary" />
                  ) : nomination.winnerReceiverName ? (
                    <>
                      {nomination.winnerReceiverName}{" "}
                      {nomination.winnerDescription}{" "}
                      {nomination.winnerMovieName}
                    </>
                  ) : (
                    (nomination.votedMovieName ?? "-")
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserPage;
