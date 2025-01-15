// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTableCreator,
  text,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `aposcar_${name}`);

export const dbeCategoryType = pgEnum("categoryType", [
  "main",
  "regular",
  "secondary",
]);

export const dbtCategoryTypesPoints = createTable("categoryTypesPoints", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryType: dbeCategoryType("categoryType").unique(),
  points: integer("points"),
});

export const dbtCategory = createTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  description: text("description"),
  type: dbeCategoryType("type").default("regular"),
});

export const categoriesRelations = relations(dbtCategory, ({ many }) => ({
  nomination: many(dbtNomination),
}));

export const dbtMovie = createTable("movies", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  description: text("description"),
  poster: text("image"),
  tagline: text("tagline"),
  backdrop: text("backdrop"),
  letterboxd: text("letterboxd"),
});

export const dbtReceiver = createTable("receivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  image: text("image"),
  letterboxd: text("letterboxd"),
});

export const dbtNomination = createTable("nominations", {
  id: uuid("id").defaultRandom().notNull().primaryKey(),
  isWinner: boolean("isWinner"),
  category: uuid("category").references(() => dbtCategory.id),
  movie: uuid("movie").references(() => dbtMovie.id),
  receiver: uuid("receiver").references(() => dbtReceiver.id),
  description: text("description"),
});

export const nominationRelations = relations(dbtNomination, ({ one }) => ({
  movie: one(dbtMovie, {
    fields: [dbtNomination.movie],
    references: [dbtMovie.id],
    relationName: "movie",
  }),
  receiver: one(dbtReceiver, {
    fields: [dbtNomination.receiver],
    references: [dbtReceiver.id],
    relationName: "receiver",
  }),
  category: one(dbtCategory, {
    fields: [dbtNomination.category],
    references: [dbtCategory.id],
  }),
}));
