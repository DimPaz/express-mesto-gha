const Card = require('../models/card');

const BadRequestError = require('../errors/BadRequestError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const PageNotFoundError = require('../errors/PageNotFoundError'); // 404

const getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(err);
      // res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(
          new PageNotFoundError('Карточка с указанным _id не найдена'),
        );
      }
      if (!card.owner.equals(owner)) {
        return next(new ForbiddenError('удалить чужую карточку нельзя'));
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ card }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные при удалении карточки',
          ),
        );
      }
      return next(err);
      // res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new PageNotFoundError('Передан несуществующий _id карточки'),
        );
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки лайка',
          ),
        );
      }
      return next(err);
      // res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(
          new PageNotFoundError('Передан несуществующий _id карточки'),
        );
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestError('Переданы некорректные данные для снятия лайка'),
        );
      }
      return next(err);
      // res.status(500).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports = {
  getCard,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
