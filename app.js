const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { PORT = 3000 } = process.env;
const app = express();

const { login, createUser } = require('./controllers/users');
const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error');

const PageNotFoundError = require('./errors/PageNotFoundError'); //404

app.use(express.json());
app.use(cookieParser());

app.post('/signin', login);
app.post('/signup', createUser);

// app.use((req, res, next) => {
//   req.user = {
//     _id: '63052a85ece704f5494fbc25',
//   };
//   next();
// });

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use('/', (req, res) => {
  // next(new PageNotFoundError('Неверно написанный URL'));
  res.status(404).send({ message: 'Неверно написанный URL' });
});
app.use(errorHandler); // мой обработчик ошибки 500

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });
  } catch (err) {
    console.log(err);
  }

  await app.listen(PORT);
  console.log(`Сервер запущен на ${PORT} порту`);
}

main();
