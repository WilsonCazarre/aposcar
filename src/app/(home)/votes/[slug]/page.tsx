import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { VotePageContent } from "./VotePageContent";
import { api } from "@/trpc/server";

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await db.query.dbtCategory.findMany();
  return categories.map((category) => ({
    slug: category.slug,
  }));
};

const VotePage = async ({ params }: { params: { slug: string } }) => {
  const categories = await api.nominations.getCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VotePageContent categorySlug={params.slug} categories={categories} />
    </Suspense>
  );
};

export default VotePage;
