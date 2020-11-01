const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

// middleware for the pages that require authentication first
const requireAuth = async (req, res, next) => {
  const posts = await Post.find({}).populate("user");
  const errMsg = "You must be logged in to access this page";

  try {
    const token = req.cookies.jwt;
    jwt.verify(token, jwtSecret);
    res.locals.error = null;
    next();
  } catch (error) {
    res.locals.error = [errMsg];
    res.render("home pages/guest-home", { posts });
  }
};

// middleware to determine the current user
const determineTheUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const decodedToken = await jwt.verify(token, jwtSecret);
    const user = await User.findById(decodedToken.id);
    res.locals.user = user;
    next();
  } catch (error) {
    res.locals.user = null;
    next();
  }
};

// middleware for prevention from going to pages for UN-AUTHENTICATED users
const denyAccessIfLogged = async (req, res, next) => {
  const posts = await Post.find({}).populate("user");
  const errMsg = "You are already logged in";
  try {
    const token = req.cookies.jwt;
    jwt.verify(token, jwtSecret);
    res.locals.error = [errMsg];
    res.render("home pages/user-home", { posts });
  } catch (error) {
    res.locals.user = null;
    res.locals.error = null;
    next();
  }
};

module.exports = {
  requireAuth,
  determineTheUser,
  denyAccessIfLogged,
};
