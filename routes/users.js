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

userRouter.get('/me', getUserMe); // возвращает авторизованного пользователя
userRouter.get('/', getUsers); // возвращает всех пользователей

// возвращает пользователя по _id
userRouter.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24).hex(),
    }),
  }),
  getUserById,
);

// обновляет профиль
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(10).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfileUser,
);

// обновляет аватар
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(regExp),
    }),
  }),

  updateAvatarUser,
);

module.exports = {
  userRouter,
};
