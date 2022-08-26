// const USERS = [
//   {
//     name: 'Dima',
//     _id: 'lajflkdjfa',
//   },
//   {
//     name: 'July',
//     _id: 'adf48f6s4fe',
//   },
// ];
const User = require('../models/user');

const getUsers = async (req, res) => {
  const users = await User.find({});
  try {
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере' });
  }
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Такого пользователя не существует' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не верный _id' });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

// const createUser = async (req, res) => {
//   const user = await new User(req.body).save();
//   res.status(200).send(user);
// };

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateAvatarUser = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
};
