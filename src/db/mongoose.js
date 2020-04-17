const mongoose = require('mongoose');

const connectionUrl = process.env.DB_CONNECTION_URL;
const databaseName = process.env.DB_NAME;

mongoose.connect(connectionUrl + `/${databaseName}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});