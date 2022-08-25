const express = require('express');

const cardsRouter = express.Router();

const {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/', express.json(), getCard); // возвращает все карточки
cardsRouter.post('/', express.json(), createCard); // создаёт карточку
cardsRouter.delete('/:cardId', express.json(), deleteCard); // удаляет карточку по идентификатору
cardsRouter.put('/:cardId/likes', express.json(), likeCard); // поставить лайк карточке
cardsRouter.delete('/:cardId/likes', express.json(), dislikeCard); // убрать лайк с карточки

module.exports = {
  cardsRouter,
};
