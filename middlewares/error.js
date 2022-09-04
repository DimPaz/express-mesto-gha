const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: 'На сервере ошибка' });
  next();
};
module.exports = errorHandler;
