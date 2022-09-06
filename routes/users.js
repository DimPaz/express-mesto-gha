const express = require('express');
const { celebrate, Joi } = require('celebrate');

const regExp = /https?:\/\/(\w+.){2,5}/;

const userRouter = express.Router();
const {
  getUserMe,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

userRouter.get('/me', express.json(), getUserMe); // возвращает авторизованного пользователя
userRouter.get('/', express.json(), getUsers); // возвращает всех пользователей

// возвращает пользователя по _id
userRouter.get(
  '/:userId',
  express.json(),
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  getUserById
);

// обновляет профиль
userRouter.patch(
  '/me',
  express.json(),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(10).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfileUser
);

userRouter.patch(
  '/me/avatar',
  express.json(),

  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(regExp),
    }),
  }),

  updateAvatarUser
); // обновляет аватар

module.exports = {
  userRouter,
};
