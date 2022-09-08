const express = require('express');
const { celebrate, Joi } = require('celebrate');

const cardsRouter = express.Router();

const regExp = /https?:\/\/(\w+.){2,5}/;

// красивый способ я тоже постараяюсь сделать
const allowedObjectKey = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

const {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// возвращает все карточки
cardsRouter.get('/', getCard);

// создаёт карточку
cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(regExp),
    }),
  }),
  createCard,
);

// удаляет карточку по идентификатору
cardsRouter.delete('/:cardId', allowedObjectKey, deleteCard);

// поставить лайк карточке
cardsRouter.put('/:cardId/likes', allowedObjectKey, likeCard);

// убрать лайк с карточки
cardsRouter.delete('/:cardId/likes', allowedObjectKey, dislikeCard);

module.exports = {
  cardsRouter,
};
