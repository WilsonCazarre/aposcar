import { SocialMediaBadge } from "@/components/SocialMediaBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

const UserPage = async ({ params }: { params: { username: string } }) => {
  const { maxScore, usersScores } = await api.votes.getUserRankings();
  const winningNominations = await api.nominations.getWinningNominations();

  const currentUser = usersScores.find(
    (user) => user.username === params.username,
  );

  if (!currentUser) return notFound();

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
      <div className="lg:w-2/3"></div>
    </div>
  );
};

export default UserPage;
