const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const config = require('./config/config');

// controllers
const { homeController } = require('./controllers/homeController');

// middlewares
const { determineTheUser } = require('./middlewares/authMiddlewares');

// routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');

mongoose.connect(config.db.uri, config.db.options).then((result) => {
  app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}!`);
  });
});

app.get('/', determineTheUser, homeController);
app.use(userRoutes);
app.use(postRoutes);
app.use(function (req, res) {
  // res.locals.error = ['Invalid URL'];
  res.redirect('/');
});
