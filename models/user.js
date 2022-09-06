const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    // required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    // required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    // required: true,
  },
  email: {
    type: String,
    required: [true, 'Поле "Email" должно быть запольнено'],
    unique: true,
    validate: [validator.isEmail, 'Неправильно заполнено поле'],
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Поле "Password" должно быть запольнено'],
  },
});

userSchema.methods.toJSON = function userPass() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
