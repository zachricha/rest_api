const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const { User, Todo } = require('../../models');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const userThreeId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'example@example.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString(),
  }]
}, {
  _id: userTwoId,
  email: 'example2@example.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString(),
  }]
}, {
  _id: userThreeId,
  email: 'example3@example.com',
  password: 'password',
}];

const todos = [{
  _id: new ObjectID(),
  text: 'test todo',
  user: userOneId,
}, {
  _id: new ObjectID(),
  text: '2nd test todo',
  completed: true,
  completedAt: 333,
  user: userTwoId,
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();
    const userThree = new User(users[2]).save();

    return Promise.all([userOne, userTwo, userThree]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
