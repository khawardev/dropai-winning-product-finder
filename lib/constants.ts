export const CACHE_DURATION_HOURS = 24

export const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
] as const

export const AUDIENCES = [
  'General Consumer',
  'Tech Enthusiasts',
  'Pet Owners',
  'Fitness Junkies',
  'Home Decorators',
] as const

export const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Home & Garden',
  'Beauty & Health',
  'Toys & Hobbies',
] as const

export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
} as const

export const SEARCH_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const
