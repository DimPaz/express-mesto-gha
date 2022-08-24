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
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.status(200).send(user);
    if (!user) {
      res.status(404).send({ message: 'Такого пользователя не существует' });
    }
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка на сервере', ...err });
  }
};

// const createUser = async (req, res) => {
//   const user = await new User(req.body).save();
//   res.status(200).send(user);
// };
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

const updateProfileUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: 'new name', about: 'new job' },
    // объект опций что бы передать в then уже обновлённую запись
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: 'Произошла ошибка', ...err })
    );
};
const updateAvatarUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: 'new foto' },
    // объект опций что бы передать в then уже обновлённую запись
    {
      new: true,
      runValidators: true,
      upsert: true,
    }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) =>
      res.status(500).send({ message: 'Произошла ошибка', ...err })
    );
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
};
