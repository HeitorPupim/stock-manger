CREATE TABLE "catalog_product" (
	"id" text PRIMARY KEY NOT NULL,
	"sku" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "catalog_product_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "is_email_verified";
