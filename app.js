const express = require('express');
// const path = require("path");
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

const { userRouter } = require('./routes/users');
const { cardsRouter } = require('./routes/cards');

// app.use(express.static(path.join(__dirname, "directory-name")));

app.use((req, res, next) => {
  req.user = {
    _id: '63052a85ece704f5494fbc25',
  };
  next();
});

// app.use((req, res, next) => {
//   next();
// });

app.use('/users', userRouter);
app.use('/cards', cardsRouter);

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
