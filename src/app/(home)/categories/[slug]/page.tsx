export const dynamicParams = false;

import { db } from "@/server/db";

export const generateStaticParams = async () => {
  const categories = await db.query.dbtCategory.findMany();

  return categories.map((category) => ({
    slug: category.slug,
  }));
};

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  return <div>{params.slug}</div>;
};

export default CategoryPage;
