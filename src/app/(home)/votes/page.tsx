import { db } from "@/server/db";
import { redirect } from "next/navigation";

// TODO: Essa página pode conter a lista de categorias e mostrar quais o usuário ainda não apostou
export default async function VotesPage() {
  const firstCategory = await db.query.dbtCategory.findFirst({
    orderBy: (categories, { asc }) => [asc(categories.name)],
  });

  if (!firstCategory) {
    return <div>No categories found</div>;
  }

  redirect(`/votes/${firstCategory.slug}`);
}
