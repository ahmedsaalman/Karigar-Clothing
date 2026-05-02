const requiredEnvKeys = ['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

const parseOrigins = (originsValue) => {
  if (!originsValue) {
    return ['http://localhost:5173', 'http://localhost:5174'];
  }

  return originsValue
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const loadEnv = () => {
  const missing = requiredEnvKeys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT || 5000),
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '15m',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    corsOrigins: parseOrigins(process.env.CORS_ORIGINS),
    requestLimit: process.env.REQUEST_BODY_LIMIT || '100kb',
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 200),
    accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME || 'karigar_access',
    refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'karigar_refresh',
    isProd: (process.env.NODE_ENV || 'development') === 'production',
  };
};

module.exports = loadEnv;
