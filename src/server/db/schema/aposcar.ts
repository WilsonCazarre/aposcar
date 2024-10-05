// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  boolean,
  pgTableCreator,
  primaryKey,
  text,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `aposcar_${name}`);

export const category = createTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug"),
  name: text("name"),
  description: text("description"),
});

export const categoriesRelations = relations(category, ({ many }) => ({
  nomination: many(nomination),
}));

export const nominee = createTable("nominees", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug"),
  name: text("name"),
  description: text("description"),
  image: text("image"),
});

export const nomineeRelations = relations(nominee, ({ many }) => ({
  primaryNominee: many(nomination, { relationName: "primaryNominee" }),
  secondaryNominee: many(nomination, { relationName: "secondaryNominee" }),
}));

export const nomination = createTable(
  "nominations",
  {
    isWinner: boolean("isWinner"),
    category: uuid("category").references(() => category.id),
    primaryNominee: uuid("primaryNominee")
      .references(() => nominee.id)
      .notNull(),
    secondaryNominee: uuid("secondaryNominee").references(() => nominee.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.primaryNominee, t.secondaryNominee] }),
  }),
);

export const nominationRelations = relations(nomination, ({ one }) => ({
  primaryNominee: one(nominee, {
    fields: [nomination.primaryNominee],
    references: [nominee.id],
    relationName: "primaryNominee",
  }),
  secondaryNominee: one(nominee, {
    fields: [nomination.secondaryNominee],
    references: [nominee.id],
    relationName: "secondaryNominee",
  }),
  category: one(category, {
    fields: [nomination.category],
    references: [category.id],
  }),
}));
