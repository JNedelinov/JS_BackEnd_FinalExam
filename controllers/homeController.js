const Post = require('../models/Post');

async function homeController (req, res) {
  const posts = await Post.find({}).populate('user');
  if (res.locals.user) {
    res.render('home pages/user-home', { posts });
  } else {
    const topPosts = posts.sort((a, b) => b.usersLiked.length - a.usersLiked.length);
    res.render('home pages/guest-home', { posts: topPosts });
  }
};

module.exports = {
  homeController,
};
