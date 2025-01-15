import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

const categorySchema;

export const categoryRouter = createTRPCRouter({
  getMany: publicProcedure.input(),
});
