DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'categoryType') THEN
    CREATE TYPE "public"."categoryType" AS ENUM('main', 'regular', 'secondary');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userRoles') THEN
    CREATE TYPE "public"."userRoles" AS ENUM('basic', 'admin');
  END IF;
END $$;

CREATE TABLE "aposcar_categories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text,
  "type" "categoryType" DEFAULT 'regular' NOT NULL,
  CONSTRAINT "aposcar_categories_slug_unique" UNIQUE("slug")
);

CREATE TABLE "aposcar_categoryTypesPoints" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "categoryType" "categoryType",
  "points" integer,
  CONSTRAINT "aposcar_categoryTypesPoints_categoryType_unique" UNIQUE("categoryType")
);

CREATE TABLE "aposcar_movies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text,
  "name" text,
  "description" text,
  "image" text,
  "tagline" text,
  "backdrop" text,
  "letterboxd" text,
  CONSTRAINT "aposcar_movies_slug_unique" UNIQUE("slug")
);

CREATE TABLE "aposcar_nominations" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "isWinner" boolean DEFAULT false NOT NULL,
  "isWinnerLastUpdate" timestamp,
  "category" uuid NOT NULL,
  "movie" uuid NOT NULL,
  "receiver" uuid,
  "description" text
);

CREATE TABLE "aposcar_receivers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text,
  "name" text,
  "image" text,
  "letterboxd" text,
  CONSTRAINT "aposcar_receivers_slug_unique" UNIQUE("slug")
);

CREATE TABLE "aposcar_votes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user" text NOT NULL,
  "nomination" uuid NOT NULL,
  "category" uuid
);

CREATE TABLE "account" (
  "userId" text NOT NULL,
  "type" text NOT NULL,
  "provider" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" text,
  "scope" text,
  "id_token" text,
  "session_state" text,
  CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);

CREATE TABLE "authenticator" (
  "credentialID" text NOT NULL,
  "userId" text NOT NULL,
  "providerAccountId" text NOT NULL,
  "credentialPublicKey" text NOT NULL,
  "counter" integer NOT NULL,
  "credentialDeviceType" text NOT NULL,
  "credentialBackedUp" boolean NOT NULL,
  "transports" text,
  CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
  CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);

CREATE TABLE "session" (
  "sessionToken" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "expires" timestamp NOT NULL
);

CREATE TABLE "user" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text,
  "username" text NOT NULL,
  "email" text,
  "emailVerified" timestamp,
  "completedOnboarding" timestamp,
  "image" text,
  "role" "userRoles" DEFAULT 'basic' NOT NULL,
  "favoriteMovie" uuid,
  "letterboxdUsername" text,
  "twitterUsername" text,
  "bskyUsername" text,
  "githubUsername" text,
  CONSTRAINT "user_username_unique" UNIQUE("username"),
  CONSTRAINT "user_email_unique" UNIQUE("email")
);

CREATE TABLE "verificationToken" (
  "identifier" text NOT NULL,
  "token" text NOT NULL,
  "expires" timestamp NOT NULL,
  CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);

ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_category_aposcar_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."aposcar_categories"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_movie_aposcar_movies_id_fk" FOREIGN KEY ("movie") REFERENCES "public"."aposcar_movies"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_receiver_aposcar_receivers_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."aposcar_receivers"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_nomination_aposcar_nominations_id_fk" FOREIGN KEY ("nomination") REFERENCES "public"."aposcar_nominations"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_category_aposcar_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."aposcar_categories"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "user" ADD CONSTRAINT "user_favoriteMovie_aposcar_movies_id_fk" FOREIGN KEY ("favoriteMovie") REFERENCES "public"."aposcar_movies"("id") ON DELETE no action ON UPDATE no action;