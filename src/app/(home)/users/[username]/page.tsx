import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { notFound } from "next/navigation";

const UserPage = async ({ params }: { params: { username: string } }) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, params.username),
  });

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{user.username}</h1>
    </div>
  );
};

export default UserPage;
