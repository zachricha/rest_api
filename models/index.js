const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI).then(() => {
}).catch(e => {
  console.log(e);
});

exports.User = require('./users');
exports.Todo = require('./todo');
