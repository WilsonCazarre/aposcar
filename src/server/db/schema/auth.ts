import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import type { AdapterAccountType } from "next-auth/adapters";
import { z } from "zod";
import { dbtVote, dbtMovie } from "./aposcar";
import { relations } from "drizzle-orm";

export const userRoles = pgEnum("userRoles", ["basic", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  username: text("username").unique().notNull(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  completedOnboarding: timestamp("completedOnboarding", { mode: "date" }),
  image: text("image"),
  role: userRoles("role").default("basic").notNull(),
  favoriteMovie: uuid("favoriteMovie").references(() => dbtMovie.id),
  letterboxdUsername: text("letterboxdUsername"),
  twitterUsername: text("twitterUsername"),
  bskyUsername: text("bskyUsername"),
  githubUsername: text("githubUsername"),
});

export const userSelectSchema = createSelectSchema(users);
export type UserSelect = z.infer<typeof userSelectSchema>;

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const userVotesRelation = relations(users, ({ many, one }) => ({
  votes: many(dbtVote),
  favoriteMovie: one(dbtMovie, {
    fields: [users.favoriteMovie],
    references: [dbtMovie.id],
  }),
}));
