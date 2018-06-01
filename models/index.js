const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB is connected');
}).catch(e => {
  console.log(e);
});

exports.User = require('./users');
exports.Todo = require('./todo');
