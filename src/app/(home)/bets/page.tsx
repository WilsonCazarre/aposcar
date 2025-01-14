import { db } from "@/server/db";
import { redirect } from "next/navigation";

export default async function BetsPage() {
  const firstCategory = await db.query.dbtCategory.findFirst({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  if (!firstCategory) {
    return <div>No categories found</div>;
  }

  redirect(`/bets/${firstCategory.slug}`);
}