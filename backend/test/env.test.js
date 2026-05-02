const test = require('node:test');
const assert = require('node:assert/strict');
const loadEnv = require('../src/config/env');

test('loadEnv throws when required variables are missing', () => {
  const original = { ...process.env };
  delete process.env.MONGO_URI;
  delete process.env.JWT_SECRET;
  delete process.env.JWT_REFRESH_SECRET;

  assert.throws(() => loadEnv(), /Missing required environment variables/);
  process.env = original;
});

test('loadEnv parses cors origins and defaults', () => {
  const original = { ...process.env };
  process.env.MONGO_URI = 'mongodb://localhost:27017/karigar';
  process.env.JWT_SECRET = 'a';
  process.env.JWT_REFRESH_SECRET = 'b';
  process.env.CORS_ORIGINS = 'http://localhost:5173, http://localhost:5174';

  const env = loadEnv();
  assert.deepEqual(env.corsOrigins, ['http://localhost:5173', 'http://localhost:5174']);
  process.env = original;
});
