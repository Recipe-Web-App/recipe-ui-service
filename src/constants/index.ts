export const API_ROUTES = {
  RECIPES: '/api/recipes',
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const QUERY_KEYS = {
  RECIPES: ['recipes'],
  RECIPE_DETAIL: ['recipe'],
  USER: ['user'],
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;
