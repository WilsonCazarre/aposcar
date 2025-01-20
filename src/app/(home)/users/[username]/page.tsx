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
import { db } from "@/server/db";
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
      <div className="flex flex-col gap-4 lg:w-1/3">
        {/* Avatar & username */}
        <div className="flex items-center gap-4">
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
