export const API_ROUTES = {
  RECIPES: '/api/recipes',
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;

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
