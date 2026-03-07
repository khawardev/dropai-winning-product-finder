CREATE TABLE "competitors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"seller_name" text NOT NULL,
	"platform" text,
	"retail_price" numeric,
	"shipping_price" numeric,
	"rating" numeric,
	"review_count" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competitors" ADD CONSTRAINT "competitors_product_id_product_results_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product_results"("id") ON DELETE no action ON UPDATE no action;