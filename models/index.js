const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp').then(() => {
  console.log('MongoDB is connected');
}).catch(e => {
  console.log(e);
});

exports.User = require('./users');
exports.Todo = require('./todo');
