import { relations } from 'drizzle-orm'
import { pgTable, uuid, text, timestamp, decimal, jsonb, integer, date, index, boolean } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
        id: text('id').primaryKey(),
        name: text('name').notNull(),
        email: text('email').notNull().unique(),
        emailVerified: boolean('emailVerified').notNull().default(false),
        image: text('image'),
        feedView: text('feedView').default('default'),
        plan: text('plan').notNull().default('free'),
        createdAt: timestamp('createdAt').notNull().defaultNow(),
        updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
        id: text('id').primaryKey(),
        expiresAt: timestamp('expiresAt').notNull(),
        token: text('token').notNull().unique(),
        createdAt: timestamp('createdAt').notNull().defaultNow(),
        updatedAt: timestamp('updatedAt').notNull().defaultNow(),
        ipAddress: text('ipAddress'),
        userAgent: text('userAgent'),
        userId: text('userId')
                .notNull()
                .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
        id: text('id').primaryKey(),
        accountId: text('accountId').notNull(),
        providerId: text('providerId').notNull(),
        userId: text('userId')
                .notNull()
                .references(() => user.id, { onDelete: 'cascade' }),
        accessToken: text('accessToken'),
        refreshToken: text('refreshToken'),
        idToken: text('idToken'),
        accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
        refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
        scope: text('scope'),
        password: text('password'),
        createdAt: timestamp('createdAt').notNull().defaultNow(),
        updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
        id: text('id').primaryKey(),
        identifier: text('identifier').notNull(),
        value: text('value').notNull(),
        expiresAt: timestamp('expiresAt').notNull(),
        createdAt: timestamp('createdAt').notNull().defaultNow(),
        updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const searchHistory = pgTable('search_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id),
  niche: text('niche').notNull(),
  targetCountry: text('target_country').notNull(),
  audience: text('audience'),
  category: text('category'),
  budgetMin: decimal('budget_min'),
  budgetMax: decimal('budget_max'),
  shippingLimit: integer('shipping_limit'),
  parameters: jsonb('parameters'),
  status: text('status').notNull().default('pending'),
  cacheKey: text('cache_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('search_cache_idx').on(table.cacheKey, table.createdAt),
])

export const productResults = pgTable('product_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  searchId: uuid('search_id').references(() => searchHistory.id),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  demandScore: decimal('demand_score'),
  profitMargin: decimal('profit_margin'),
  competitionLevel: text('competition_level'),
  shippingDays: integer('shipping_days'),
  suppliersCount: integer('suppliers_count'),
  trending: boolean('trending').default(false),
  costPrice: decimal('cost_price'),
  sellingPrice: decimal('selling_price'),
  aiAnalysis: jsonb('ai_analysis'),
  discoveredAt: timestamp('discovered_at').defaultNow().notNull(),
})

export const supplierLinks = pgTable('supplier_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => productResults.id),
  supplierName: text('supplier_name').notNull(),
  costPrice: decimal('cost_price'),
  shippingCost: decimal('shipping_cost'),
  shippingDays: integer('shipping_days'),
  reliabilityScore: decimal('reliability_score'),
  productUrl: text('product_url'),
  location: text('location'),
  categories: jsonb('categories'),
  minOrder: text('min_order'),
  verified: boolean('verified').default(false),
})

export const competitors = pgTable('competitors', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => productResults.id),
  sellerName: text('seller_name').notNull(),
  platform: text('platform'),
  retailPrice: decimal('retail_price'),
  shippingPrice: decimal('shipping_price'),
  rating: decimal('rating'),
  reviewCount: integer('review_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const savedProducts = pgTable('saved_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').references(() => user.id),
  productId: uuid('product_id').references(() => productResults.id),
  notes: text('notes'),
  savedAt: timestamp('saved_at').defaultNow().notNull(),
})

export const marketData = pgTable('market_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  niche: text('niche').notNull(),
  date: date('date').notNull(),
  trendScore: decimal('trend_score'),
  metadata: jsonb('metadata'),
})

export const apiCache = pgTable('api_cache', {
  key: text('key').primaryKey(),
  data: jsonb('data'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const userRelations = relations(user, ({ many }) => ({
        sessions: many(session),
        accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
        user: one(user, {
                fields: [session.userId],
                references: [user.id],
        }),
}))

export const accountRelations = relations(account, ({ one }) => ({
        user: one(user, {
                fields: [account.userId],
                references: [user.id],
        }),
}))
