const jwt = require('jsonwebtoken');

function signAccess(user) {
  return jwt.sign(
    { id: user._id, role: user.role },      // Payload: user id and role
    process.env.JWT_ACCESS_SECRET,          // Secret key for signing access tokens
    { expiresIn: process.env.ACCESS_EXPIRES_IN || '15m' }   // Token expiration (default 15 minutes)
  );
}

function signRefresh(user) {
  return jwt.sign(
    { id: user._id },                   // Payload: only user id
    process.env.JWT_REFRESH_SECRET,     // Secret key for signing refresh tokens
    { expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' }  // Token expiration (default 7 days)
  );
}

function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

module.exports = { signAccess, signRefresh, verifyRefresh };