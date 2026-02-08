export const TOKEN_KEYS = {
  ACCESS: 'token',
  REFRESH: 'refreshToken',
} as const;

export const STORAGE_KEYS = {
  REMEMBER_ME: 'rememberMe',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 0,
} as const;

export const SORT_OPTIONS = {
  NAME: 'name',
  PRICE: 'price',
  RATING: 'rating',
  VENDOR: 'vendor',
  SKU: 'sku',
} as const;

export type SortField = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];
export type SortDirection = 'asc' | 'desc';
