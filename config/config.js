const config = {
  db: {
    // ! --- ADD DATABASE NAME ---
    uri: 'mongodb://127.0.0.1:27017/tutorials',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  },
  port: 3000,
  jwtSecret: 'myJWTsecret',
  saltRounds: 5,
};

module.exports = config;
