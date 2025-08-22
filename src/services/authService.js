const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('./tokenService');

async function register({ username, email, password, role }) {

// Validate required fields
  if (!username || !email || !password || !role) {
    const err = new Error('username, email, password, role are required');
    err.status = 400;
    throw err;
  }

// Check if a user with same email or username already exists
  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw Object.assign(new Error('User already exists'), { status: 400 });

// Hash the password before saving
  const hashed = await bcrypt.hash(password, 10);
  return User.create({ username, email, password: hashed, role });
}

  // Logs in a user
async function login({ email, password }) {
  
  // Find user and include refreshToken field
  const user = await User.findOne({ email }).select('+refreshToken');
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  // Compare provided password with hashed password
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  // Generate access and refresh tokens
  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  // Store refresh token in DB
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken, user: { id: user._id, username: user.username, email: user.email, role: user.role } };
}

async function refresh(token) {
  // Verify token signature and expiration
  const payload = verifyRefresh(token);
  const user = await User.findById(payload.id).select('+refreshToken');

  // Ensure the token matches the one stored in DB
  if (!user || user.refreshToken !== token) throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  return { accessToken: signAccess(user) };
}

async function logout(token) {
  try {
    const payload = verifyRefresh(token);
    const user = await User.findById(payload.id).select('+refreshToken');
    if (user) {
      user.refreshToken = null;  // Remove token from DB to prevent further use
      await user.save();
    }
  } catch {
    // ignore invalid token
  }
}

module.exports = { register, login, refresh, logout };