import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { auth } from "@/server/auth";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default async function Home() {
  const session = await auth();
  const allUsers = await db.select().from(users).orderBy(users.name);

  return (
    <div className="flex h-full justify-between gap-12">
      <div className="w-2/3">
        <h2 className="pb-4 text-2xl font-semibold">Ranking</h2>

        <div className="flex flex-col gap-4">
          {allUsers.map((user) => (
            <Link
              key={user.id}
              href={`/users/${user.id}`}
              className="flex w-full items-center gap-4 rounded-md border border-secondary p-4 hover:bg-secondary"
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
                <p className="font-sm">{user.name}</p>
                <Progress value={69} max={100} className="h-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="w-1/3">
        <h2 className="pb-4 text-2xl font-semibold">Last updates</h2>

        <div className="flex flex-col gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Best Picture</CardTitle>
            </CardHeader>

            <CardContent>
              <p>Megamind :)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
