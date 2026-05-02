require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const loadEnv = require('./config/env');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// ── Route imports ─────────────────────────────────────────────
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const discountRoutes = require('./routes/discount.routes');
const cartRoutes = require('./routes/cart.routes');

const env = loadEnv();

// ── Connect to MongoDB ────────────────────────────────────────
connectDB();

const app = express();
app.set('trust proxy', 1);

// ── Core Middleware ───────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS policy violation'));
    },
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  })
);
if (env.nodeEnv !== 'test') {
  app.use(morgan(env.isProd ? 'combined' : 'dev'));
}
app.use(cookieParser());
app.use(express.json({ limit: env.requestLimit }));
app.use(express.urlencoded({ extended: false }));

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Karigar API is running 🚀', env: process.env.NODE_ENV });
});

// ── API Routes ────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/cart', cartRoutes);

app.use(notFound);

// ── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`Karigar API running on http://localhost:${PORT}`);
  console.log(`Environment: ${env.nodeEnv}`);
});
