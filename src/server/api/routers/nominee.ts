import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getMany: publicProcedure.input(),
});
