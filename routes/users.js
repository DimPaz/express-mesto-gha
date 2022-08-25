const express = require('express');

const userRouter = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatarUser,
} = require('../controllers/users');

userRouter.get('/', express.json(), getUsers); // возвращает всех пользователей
userRouter.get('/:userId', express.json(), getUserById); // возвращает пользователя по _id
userRouter.post('/', express.json(), createUser); // создаёт пользователя
userRouter.patch('/me', express.json(), updateProfileUser); // обновляет профиль
userRouter.patch('/me/avatar', express.json(), updateAvatarUser); // обновляет аватар

module.exports = {
  userRouter,
};
