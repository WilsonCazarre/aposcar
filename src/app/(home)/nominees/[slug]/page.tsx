export const dynamicParams = false;

import { db } from "@/server/db";

export const generateStaticParams = async () => {
  const nominees = await db.query.dbtNominee.findMany();

  return nominees.map((nominee) => ({
    slug: nominee.slug,
  }));
};

const NomineePage = ({ params }: { params: { slug: string } }) => {
  return <div>{params.slug}</div>;
};

export default NomineePage;
