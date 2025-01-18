import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent"
import { api } from "@/trpc/server";


export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await db.query.dbtCategory.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
};

const VotePage = async ({ params }: { params: { slug: string } }) => {
  const data = await api.nominations.getCategoryWithNavigation({
    categorySlug: params.slug,
  });

  if (!data.currentCategory) return notFound();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotePageContent {...data} />
    </Suspense>
  );
};

export default VotePage;
