// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTableCreator,
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

export const dbtCategory = createTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  description: text("description"),
});

export const categoriesRelations = relations(dbtCategory, ({ many }) => ({
  nomination: many(dbtNomination),
}));

export const dbeNomineeType = pgEnum("nomineeType", ["movie", "person"]);

export const dbtNominee = createTable("nominees", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").unique(),
  name: text("name"),
  description: text("description"),
  image: text("image"),
  type: dbeNomineeType("type").default("movie"),
  tagline: text("tagline"),
  backdrop: text("backdrop"),
  letterboxd: text("letterboxd"),
});

export const nomineeRelations = relations(dbtNominee, ({ many }) => ({
  primaryNominee: many(dbtNomination, { relationName: "primaryNominee" }),
  secondaryNominee: many(dbtNomination, { relationName: "secondaryNominee" }),
}));

export const dbtNomination = createTable("nominations", {
  id: uuid("id").defaultRandom().notNull(),
  isWinner: boolean("isWinner"),
  category: uuid("category").references(() => dbtCategory.id),
  primaryNominee: uuid("primaryNominee")
    .references(() => dbtNominee.id)
    .notNull(),
  secondaryNominee: uuid("secondaryNominee").references(() => dbtNominee.id),
});

export const nominationRelations = relations(dbtNomination, ({ one }) => ({
  primaryNominee: one(dbtNominee, {
    fields: [dbtNomination.primaryNominee],
    references: [dbtNominee.id],
    relationName: "primaryNominee",
  }),
  secondaryNominee: one(dbtNominee, {
    fields: [dbtNomination.secondaryNominee],
    references: [dbtNominee.id],
    relationName: "secondaryNominee",
  }),
  category: one(dbtCategory, {
    fields: [dbtNomination.category],
    references: [dbtCategory.id],
  }),
}));
