CREATE TABLE "winning_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"keyword" text NOT NULL,
	"region" text NOT NULL,
	"timeframe" text NOT NULL,
	"pipeline_data" jsonb NOT NULL,
	"ai_analysis" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "api_cache" CASCADE;--> statement-breakpoint
DROP TABLE "competitors" CASCADE;--> statement-breakpoint
DROP TABLE "market_data" CASCADE;--> statement-breakpoint
DROP TABLE "product_results" CASCADE;--> statement-breakpoint
DROP TABLE "saved_products" CASCADE;--> statement-breakpoint
DROP TABLE "saved_sellers" CASCADE;--> statement-breakpoint
DROP TABLE "search_history" CASCADE;--> statement-breakpoint
DROP TABLE "supplier_links" CASCADE;--> statement-breakpoint
ALTER TABLE "winning_products" ADD CONSTRAINT "winning_products_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "winning_products" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "winning_products" USING btree ("created_at");