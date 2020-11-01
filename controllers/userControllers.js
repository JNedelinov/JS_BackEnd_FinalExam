const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const { authErrorHandler } = require('../errorHandlers/authErrorHandlers');

// !CREATE_TOKEN
const createToken = (id) => {
  return jwt.sign({ id }, jwtSecret, { expiresIn: '1h' });
};

// !MAX_AGE_OF_COOKIE
const maxAge = 1000 * 60 * 60;

// GET login
const login_GET = (req, res) => {
  res.render('user pages/login');
};

// POST login
const login_POST = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge });
    res.locals.user = user;
    res.redirect('/');
  } catch (error) {
    const errors = authErrorHandler(error);
    res.locals.error = errors.slice();
    res.render('user pages/login', { login: req.body });
  }
};

// GET register
const register_GET = (req, res) => {
  res.render('user pages/register');
};

// POST register
const register_POST = async (req, res) => {
  const { username, password, rePassword } = req.body;

  try {
    if (!rePassword && password && username) {
      throw new Error('Please repeat the password');
    }

    if (password !== rePassword && username && rePassword) {
      throw new Error("Passwords don't match");
    }

    const user = await User.create({ username, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge });
    res.locals.user = user;
    res.redirect('/');
  } catch (error) {
    const errors = authErrorHandler(error);
    res.locals.error = errors.slice();
    res.render('user pages/register', { register: req.body });
  }
};

// GET logout
const logout_GET = (req, res) => {
  res.clearCookie('jwt');
  res.redirect('/');
};

module.exports = {
  login_GET,
  login_POST,
  register_GET,
  register_POST,
  logout_GET,
};
