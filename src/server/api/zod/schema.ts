import {
  dbeCategoryType,
  dbtCategory,
  dbtMovie,
  dbtNomination,
  dbtReceiver,
} from "@/server/db/schema/aposcar";
import { createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

export const categorySchema = createSelectSchema(dbtCategory);
export type Category = z.infer<typeof categorySchema>;

export const categoryTypesSchema = createSelectSchema(dbeCategoryType);
export type CategoryType = z.infer<typeof categoryTypesSchema>;

export const moviesSchema = createSelectSchema(dbtMovie);
export type Movie = z.infer<typeof moviesSchema>;

export const nominationSchema = createSelectSchema(dbtNomination);
export type Nomination = z.infer<typeof nominationSchema>;

export const receiverSchema = createSelectSchema(dbtReceiver)
export type Receiver = z.infer<typeof receiverSchema>