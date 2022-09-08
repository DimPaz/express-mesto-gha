const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const PageNotFoundError = require('../errors/PageNotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const duplicateKey = 11000;

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new PageNotFoundError('Такого пользователя не существует'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Не верный _id'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10).then((heshedPassword) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: heshedPassword,
    })
      .then((user) => {
        res.send({ user });
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(
            new BadRequestError(
              'Переданы некорректные данные при создании профиля',
            ),
          );
        }
        if (err.code === duplicateKey) {
          return next(new ConflictError('Такой email уже существует'));
        }
        return next(err);
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UnauthorizedError('Неправильно введен логин или пароль'))
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({ _id: user._id }, 'SECRET', {
              expiresIn: '7d',
            });

            res.cookie('jwt', token, {
              maxAge: 604800,
              httpOnly: true,
              sameSite: true,
            });

            res.send({ data: user.toJSON() });
          } else {
            next(new UnauthorizedError('Неправильно введен логин или пароль'));
          }
        })
        .catch(next);
    })
    .catch(next);
};

const updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return next(
          new PageNotFoundError('Пользователь с указанным _id не найден'),
        );
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении профиля',
          ),
        );
      }
      return next(err);
    });
};

const updateAvatarUser = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (!user) {
        return next(
          new PageNotFoundError('Пользователь с указанным _id не найден'),
        );
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при обновлении аватара',
          ),
        );
      }
      return next(err);
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
