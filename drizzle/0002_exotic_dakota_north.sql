CREATE TYPE "public"."categoryType" AS ENUM('main', 'regular', 'secondary');--> statement-breakpoint
CREATE TYPE "public"."userRoles" AS ENUM('basic', 'admin');--> statement-breakpoint
CREATE TABLE "aposcar_categoryTypesPoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"categoryType" "categoryType" DEFAULT 'regular',
	"points" integer
);
--> statement-breakpoint
ALTER TABLE "aposcar_categories" ADD COLUMN "type" "categoryType" DEFAULT 'regular';--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "userRoles" DEFAULT 'basic' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "isAdmin";