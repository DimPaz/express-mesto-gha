const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
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
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((heshedPassword) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: heshedPassword,
    })
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
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.send('403').send({ message: 'поля должны быть заполены' });
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('Пользователь не найден'))
    .then((user) => {
      bcrypt.compare(password, user.password).then((isUserValid) => {
        if (isUserValid) {
          const token = jwt.sign(
            {
              _id: user._id,
            },
            'SECRET'
          );

          res.cookie('jwt', token, {
            maxAge: 604800,
            httpOnly: true,
            sameSite: true,
          });

          res.send({ data: user.toJSON() });
        } else {
          res
            .status(401)
            .send({ message: 'Неправильно введен логин или пароль' });
        }
      });
    })
    .catch(next);
};

const updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    }
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
      upsert: false,
    }
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
  getUserMe,
  createUser,
  login,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
};
