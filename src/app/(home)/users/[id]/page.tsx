import { db } from "@/server/db";
import { users } from "@/server/db/schema/auth";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const allUsers = await db.select().from(users).orderBy(users.name);
  return allUsers.map((user) => ({
    id: user.id,
  }));
};

const UserPage = async ({ params }: { params: { id: string } }) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, params.id),
  });

  if (!user) return notFound();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
};

export default UserPage;
