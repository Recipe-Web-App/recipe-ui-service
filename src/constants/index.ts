export const AUTH_API_ROUTES = {
  HEALTH: '/health',
  READINESS: '/health/ready',
  LIVENESS: '/health/live',
  METRICS: '/metrics',
  AUTHORIZE: '/oauth2/authorize',
  TOKEN: '/oauth2/token',
  INTROSPECT: '/oauth2/introspect',
  REVOKE: '/oauth2/revoke',
  USERINFO: '/oauth2/userinfo',
  DISCOVERY: '/.well-known/oauth-authorization-server',
  REGISTER: '/user-management/auth/register',
  LOGIN: '/user-management/auth/login',
  LOGOUT: '/user-management/auth/logout',
  REFRESH: '/user-management/auth/refresh',
  PASSWORD_RESET: '/user-management/auth/reset-password',
  PASSWORD_RESET_CONFIRM: '/user-management/auth/reset-password/confirm',
} as const;

export const APP_ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
} as const;

export const ROUTE_PROTECTION = {
  RETURN_URL_PARAM: 'returnUrl',
  DEFAULT_LOGIN_URL: '/login',
  DEFAULT_HOME_URL: '/',
} as const;

export const QUERY_KEYS = {
  RECIPES: ['recipes'],
  RECIPE_DETAIL: ['recipe'],
  USER: ['user'],
  AUTH: {
    USER_INFO: ['auth', 'userInfo'],
    DISCOVERY: ['auth', 'discovery'],
    HEALTH: ['auth', 'health'],
    READINESS: ['auth', 'readiness'],
    LIVENESS: ['auth', 'liveness'],
  },
  USER_MANAGEMENT: {
    USER: ['userManagement', 'user'],
    USERS: ['userManagement', 'users'],
    FOLLOWING: ['userManagement', 'following'],
    FOLLOWERS: ['userManagement', 'followers'],
    NOTIFICATIONS: ['userManagement', 'notifications'],
    UNREAD_COUNT: ['userManagement', 'unreadCount'],
    PREFERENCES: ['userManagement', 'preferences'],
    ACTIVITY: ['userManagement', 'activity'],
    HEALTH: ['userManagement', 'health'],
    METRICS: ['userManagement', 'metrics'],
    MUTUAL_FOLLOWS: ['userManagement', 'mutualFollows'],
    FOLLOW_STATS: ['userManagement', 'followStats'],
  },
  RECIPE_MANAGEMENT: {
    // Recipe operations
    RECIPES: ['recipeManagement', 'recipes'],
    RECIPE: ['recipeManagement', 'recipe'],
    RECIPE_VERSIONS: ['recipeManagement', 'recipeVersions'],

    // Ingredient operations
    INGREDIENTS: ['recipeManagement', 'ingredients'],
    RECIPE_INGREDIENTS: ['recipeManagement', 'recipeIngredients'],

    // Step operations
    STEPS: ['recipeManagement', 'steps'],
    RECIPE_STEPS: ['recipeManagement', 'recipeSteps'],
    STEP_COMMENTS: ['recipeManagement', 'stepComments'],

    // Tag operations
    TAGS: ['recipeManagement', 'tags'],
    RECIPE_TAGS: ['recipeManagement', 'recipeTags'],

    // Review operations
    REVIEWS: ['recipeManagement', 'reviews'],
    RECIPE_REVIEWS: ['recipeManagement', 'recipeReviews'],

    // Comment operations
    RECIPE_COMMENTS: ['recipeManagement', 'recipeComments'],

    // Revision operations
    REVISIONS: ['recipeManagement', 'revisions'],
    RECIPE_REVISIONS: ['recipeManagement', 'recipeRevisions'],
    STEP_REVISIONS: ['recipeManagement', 'stepRevisions'],
    INGREDIENT_REVISIONS: ['recipeManagement', 'ingredientRevisions'],

    // Media operations
    MEDIA: ['recipeManagement', 'media'],
    RECIPE_MEDIA: ['recipeManagement', 'recipeMedia'],

    // Search operations
    SEARCH: ['recipeManagement', 'search'],
    SEARCH_SUGGESTIONS: ['recipeManagement', 'searchSuggestions'],

    // Collection operations
    COLLECTIONS: ['recipeManagement', 'collections'],
    COLLECTION: ['recipeManagement', 'collection'],
    COLLECTION_RECIPES: ['recipeManagement', 'collectionRecipes'],
    COLLECTION_COLLABORATORS: ['recipeManagement', 'collectionCollaborators'],

    // Health and monitoring
    HEALTH: ['recipeManagement', 'health'],
    METRICS: ['recipeManagement', 'metrics'],
    MONITORING: ['recipeManagement', 'monitoring'],
  },
  RECIPE_SCRAPER: {
    // Health endpoints
    ROOT: ['recipeScraper', 'root'],
    METRICS: ['recipeScraper', 'metrics'],
    LIVENESS: ['recipeScraper', 'liveness'],
    READINESS: ['recipeScraper', 'readiness'],
    HEALTH: ['recipeScraper', 'health'],
    LEGACY_HEALTH: ['recipeScraper', 'legacyHealth'],

    // Recipe operations
    RECIPES: ['recipeScraper', 'recipes'],
    POPULAR_RECIPES: ['recipeScraper', 'popularRecipes'],

    // Nutrition operations
    NUTRITION: ['recipeScraper', 'nutrition'],
    RECIPE_NUTRITION: ['recipeScraper', 'recipeNutrition'],
    INGREDIENT_NUTRITION: ['recipeScraper', 'ingredientNutrition'],

    // Ingredient operations
    INGREDIENTS: ['recipeScraper', 'ingredients'],
    INGREDIENT_SUBSTITUTIONS: ['recipeScraper', 'ingredientSubstitutions'],

    // Pairing operations
    PAIRING: ['recipeScraper', 'pairing'],
    RECIPE_PAIRINGS: ['recipeScraper', 'recipePairings'],

    // Shopping operations
    SHOPPING: ['recipeScraper', 'shopping'],
    INGREDIENT_SHOPPING: ['recipeScraper', 'ingredientShopping'],
    RECIPE_SHOPPING: ['recipeScraper', 'recipeShopping'],

    // Admin operations
    ADMIN: ['recipeScraper', 'admin'],
    CLEAR_CACHE: ['recipeScraper', 'clearCache'],
  },
  MEAL_PLAN_MANAGEMENT: {
    // Meal plan operations
    MEAL_PLANS: ['mealPlanManagement', 'mealPlans'],
    MEAL_PLAN: ['mealPlanManagement', 'mealPlan'],

    // Health endpoints
    HEALTH: ['mealPlanManagement', 'health'],
    READINESS: ['mealPlanManagement', 'readiness'],
    LIVENESS: ['mealPlanManagement', 'liveness'],
    VERSION: ['mealPlanManagement', 'version'],

    // Metrics
    METRICS: ['mealPlanManagement', 'metrics'],

    // System endpoints
    SWAGGER_UI: ['mealPlanManagement', 'swaggerUI'],
    OPENAPI_JSON: ['mealPlanManagement', 'openApiJson'],
    SERVICE_INFO: ['mealPlanManagement', 'serviceInfo'],
    CONFIGURATION: ['mealPlanManagement', 'configuration'],
  },
  MEDIA_MANAGEMENT: {
    // Health endpoints
    HEALTH: ['mediaManagement', 'health'],
    READINESS: ['mediaManagement', 'readiness'],
    METRICS: ['mediaManagement', 'metrics'],

    // Media operations
    MEDIA: ['mediaManagement', 'media'],
    MEDIA_LIST: ['mediaManagement', 'mediaList'],
    UPLOAD_STATUS: ['mediaManagement', 'uploadStatus'],

    // Recipe integration
    RECIPE_MEDIA: ['mediaManagement', 'recipeMedia'],
    INGREDIENT_MEDIA: ['mediaManagement', 'ingredientMedia'],
    STEP_MEDIA: ['mediaManagement', 'stepMedia'],
  },
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
} as const;

export const OAUTH2_CONFIG = {
  SCOPES: {
    OPENID: 'openid',
    PROFILE: 'profile',
    USER_READ: 'user:read',
    USER_WRITE: 'user:write',
    ADMIN: 'admin',
  },
  GRANT_TYPES: {
    AUTHORIZATION_CODE: 'authorization_code',
    CLIENT_CREDENTIALS: 'client_credentials',
    REFRESH_TOKEN: 'refresh_token',
  },
  RESPONSE_TYPES: {
    CODE: 'code',
  },
  CODE_CHALLENGE_METHOD: 'S256',
} as const;

export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  PKCE_VERIFIER: 'pkceVerifier',
  PKCE_STATE: 'pkceState',
} as const;

// Export route constants
export * from './routes';
