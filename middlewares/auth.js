const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(new UnauthorizedError('Нужно авторизовать пользователя'));
  }
  req.user = payload;
  next();
};
module.exports = auth;
