const User = require('../models/User');
const Post = require('../models/Post');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const { postErrorHandler } = require('../errorHandlers/postErrorHandlers');

// GET create
const create_GET = (req, res) => {
  res.render('course pages/create-course');
};

// POST create
const create_POST = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const { title, description, imageUrl, duration } = req.body;
    const decodedToken = await jwt.verify(token, jwtSecret);
    const post = await Post.create({
      title,
      description,
      imageUrl,
      duration,
      creatorId: decodedToken.id,
    });
    res.redirect(`/details/${post._id}`);
  } catch (error) {
    const errors = postErrorHandler(error);
    res.locals.errors = errors.slice();
    const post = Object.assign({}, req.body);
    res.render('course pages/create-course', { post });
  }
};

// GET details
const details_GET = async (req, res) => {
  const posts = await Post.find({}).populate('user');
  const errMsg = 'Invalid URL';
  const id = req.params.id;
  try {
    const post = await Post.findById(id).populate('user');
    res.render('course pages/course-details', { post });
  } catch (error) {
    res.locals.error = [errMsg];
    res.render('home pages/user-home', { posts });
  }
};

// GET edit
const edit_GET = async (req, res) => {
  const posts = await Post.find({}).populate('user');
  const errMsg = 'Invalid URL';
  const id = req.params.id;
  try {
    const post = await Post.findById(id).populate('user');
    res.render('course pages/edit-course', { post });
  } catch (error) {
    res.locals.error = [errMsg];
    res.render('home pages/user-home', { posts });
  }
};

// POST edit
const edit_POST = async (req, res) => {
  const id = req.params.id;

  try {
    const { title, description, imageUrl, duration } = req.body;

    if (!title || !description || !imageUrl || !duration) {
      throw new Error('All fields are required');
    }

    if (title.length < 4) {
      throw new Error('The title must be at least 4 characters long');
    }

    const posts = await Post.find({});
    const isMoreThanOne = posts.reduce((acc, curr) => {
      if (curr.title === title) {
        acc += 1;
      }
      return acc;
    }, 0);
    if (isMoreThanOne > 1) {
      const error = { code: 11000 };
      throw error;
    }

    if (description.length < 20) {
      throw new Error("Description's length should be at least 20 characters");
    }

    if (!/(https|http)/.test(imageUrl)) {
      throw new Error('Enter a valid Url for the image');
    }

    if (!/(\d+) (weeks|week)/.test(duration)) {
      throw new Error(
        'Invalid entered duration. It should be like this - 4 weeks'
      );
    }

    const post = await Post.findByIdAndUpdate(id, {
      title,
      description,
      imageUrl,
      duration,
    });
    res.redirect(`/details/${post._id}`);
  } catch (error) {
    const errors = postErrorHandler(error);
    res.locals.errors = errors.slice();
    const post = Object.assign({}, req.body, { _id: id });
    res.render('course pages/edit-course', { post });
  }
};

// ENROLL
const enroll_GET = async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.jwt;
  const decodedToken = await jwt.verify(token, jwtSecret);
  const userId = decodedToken.id;

  const post = await Post.findById(id).populate('user');
  const user = await User.findById(userId).populate('post');

  const usersLikedArr = post.usersLiked.find((user) => user._id === userId);
  const postsLikedArr = user.likedPosts.find((play) => play._id === id);

  if (!usersLikedArr && !postsLikedArr) {
    user.likedPosts.push(post);
    post.usersLiked.push(user);

    // return;
    await User.findByIdAndUpdate(userId, {
      $set: { likedPosts: user.likedPosts },
    });
    // return
    await Post.findByIdAndUpdate(id, { $set: { usersLiked: post.usersLiked } });
  }

  res.redirect(`/details/${id}`);
};

// SEARCH
const search_GET = async (req, res) => {
  const { search } = req.body;
  try {
    const posts = await Post.find({title: {"$regex": search, "$options": "i"}});
    res.render('home pages/user-home', {posts});
  } catch (error) {
    console.log(error);
  }
}

// GET delete
const delete_GET = async (req, res) => {
  const id = req.params.id;

  try {
    await Post.findByIdAndDelete(id);
    res.redirect('/');
  } catch (error) {
    res.redirect(`/details/${id}`);
  }
};

module.exports = {
  search_GET,
  create_GET,
  create_POST,
  details_GET,
  edit_GET,
  edit_POST,
  enroll_GET,
  delete_GET,
};
