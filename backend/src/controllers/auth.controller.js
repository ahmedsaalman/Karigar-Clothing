const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const loadEnv = require('../config/env');

const env = loadEnv();

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, version: user.tokenVersion }, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  });

const signRefreshToken = (user, nonce) =>
  jwt.sign({ id: user._id, nonce, version: user.tokenVersion }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpire,
  });

const getCookieOptions = (maxAgeMs) => {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    maxAge: maxAgeMs,
  };
};

const toMilliseconds = (duration) => {
  if (duration.endsWith('d')) return Number(duration.slice(0, -1)) * 24 * 60 * 60 * 1000;
  if (duration.endsWith('h')) return Number(duration.slice(0, -1)) * 60 * 60 * 1000;
  if (duration.endsWith('m')) return Number(duration.slice(0, -1)) * 60 * 1000;
  return 7 * 24 * 60 * 60 * 1000;
};

const issueAuthCookies = (res, user) => {
  const nonce = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, nonce);

  user.refreshTokenHash = hashToken(refreshToken);

  res.cookie(
    env.accessTokenCookieName,
    accessToken,
    getCookieOptions(toMilliseconds(env.jwtExpire))
  );
  res.cookie(
    env.refreshTokenCookieName,
    refreshToken,
    getCookieOptions(toMilliseconds(env.jwtRefreshExpire))
  );

  return { accessToken, refreshToken };
};

const clearAuthCookies = (res) => {
  res.clearCookie(env.accessTokenCookieName, getCookieOptions(0));
  res.clearCookie(env.refreshTokenCookieName, getCookieOptions(0));
};

// ── POST /api/auth/register ──────────────────────────────────
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if email already in use
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const { accessToken } = issueAuthCookies(res, user);
    await user.save();

    res.status(201).json({
      success: true,
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user and explicitly include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const { accessToken } = issueAuthCookies(res, user);
    await user.save();

    res.json({
      success: true,
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.[env.refreshTokenCookieName];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Missing refresh token' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, env.jwtRefreshSecret);
    } catch (error) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id).select('+refreshTokenHash');
    if (!user || !user.refreshTokenHash) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    const incomingHash = hashToken(token);
    const storedBuffer = Buffer.from(user.refreshTokenHash, 'hex');
    const incomingBuffer = Buffer.from(incomingHash, 'hex');
    const hashesMatch =
      storedBuffer.length === incomingBuffer.length &&
      crypto.timingSafeEqual(storedBuffer, incomingBuffer);

    if (!hashesMatch || user.tokenVersion !== decoded.version) {
      user.refreshTokenHash = null;
      await user.save();
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: 'Session invalidated' });
    }

    const { accessToken } = issueAuthCookies(res, user);
    await user.save();

    res.json({ success: true, token: accessToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.[env.refreshTokenCookieName];
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      }
    }

    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { tokenVersion: 1 },
      refreshTokenHash: null,
    });

    clearAuthCookies(res);
    res.json({ success: true, message: 'Logged out from all sessions' });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is already set by the protect middleware
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { register, login, refreshToken, logout, logoutAll, getMe };
