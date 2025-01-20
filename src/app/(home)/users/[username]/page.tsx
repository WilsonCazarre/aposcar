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

  const userNominations = await api.votes.getUserNominations({
    username: currentUser.username,
  });

  // TODO: Fodase eu desisto

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* User info */}
      <div className="flex flex-col lg:w-1/3">
        {/* Backdrop */}
        <div className="fixed left-0 top-0 block aspect-[16/9] w-full lg:w-1/3">
          <Image
            src={
              "https://a.ltrbxd.com/resized/sm/upload/8h/bo/f2/33/Screen%20Shot%202023-03-15%20at%2016.47.26-1200-1200-675-675-crop-000000.jpg"
            }
            alt="Favorite movie backdrop"
            fill
            className="object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-background" />
          <div className="absolute inset-y-0 right-0 lg:w-1/2 lg:bg-gradient-to-r lg:from-transparent lg:to-background" />
        </div>

        <div className="relative z-10 bg-red-500 [&>*]:pt-[calc(100%*5/16)]">
          {/* Avatar & username */}
          <div className="flex items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser.profilePic ?? ""} />
              <AvatarFallback className="text-4xl font-bold">
                {currentUser.username?.[0]?.toUpperCase() ?? "@"}
              </AvatarFallback>
            </Avatar>
            <h1 className="pt-4 text-2xl font-bold">{currentUser.username}</h1>
          </div>

          {/* Social medias */}
          <div className="space-x-2">
            <SocialMediaBadge
              url={`https://letterboxd.com/` + currentUser.username}
              text="Letterboxd"
            />
            <SocialMediaBadge
              url={`https://x.com/` + currentUser.username}
              text="Twitter"
            />
            <SocialMediaBadge
              url={`https://bsky.app/profile/` + currentUser.username}
              text="Bluesky"
            />
          </div>

          {/* General Info */}
          <div className="text-sm text-muted-foreground">
            (Add score, position, favorite movie, etc here)
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
