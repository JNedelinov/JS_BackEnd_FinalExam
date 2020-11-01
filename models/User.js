const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = require('../config/config').saltRounds;

// !SCHEMA_FOR_USERNAME

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'The username is required'],
    minlength: [5, 'The username must be at least 5 characters long'],
    validate: {
      validator: function (value) {
        return /[A-Za-z0-9]+/.test(value);
      },
      message:
        'The username can contain any letters from A to Z and any numbers from 0 through 9',
    },
  },
  password: {
    type: String,
    required: [true, 'The password is required'],
    minlength: [5, 'The password must be at least 5 characters long'],
  },
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
});

// !PRE_SAVE_FOR_PASSWORD_HASHING

UserSchema.pre('save', function (next) {
  const user = this;

  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    user.password = hash;
    next();
  });
});

// !CREATING_LOGIN_METHOD

UserSchema.statics.login = async function (username, password) {
  const user = await User.findOne({ username });
  if (user) {
    const same = await bcrypt.compare(password, user.password);
    if (same) {
      return user;
    } else {
      throw new Error('Wrong username or password');
    }
  } else {
    throw new Error('Wrong username or password');
  }
};

// !EXPORTING

const User = mongoose.model('user', UserSchema);
module.exports = User;
