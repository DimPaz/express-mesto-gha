const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Внутренняя проблема сервера' : message,
  });
  next();
};
module.exports = errorHandler;
