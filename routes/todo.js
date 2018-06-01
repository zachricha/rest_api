const express = require('express');

const { User, Todo } = require('../models');
const auth = require('../middleware/auth');

const Router = express.Router();

Router
  .route('/todos')
  .get(auth, (req, res) => {
    Todo.find({
      user: req.user.id,
    }).then((todos) => {
      res.send({todos});
    }).catch(e => {
      res.status(400).send(e);
    });
  })
  .post((req, res) => {
    const todo = new Todo({
      text: req.body.text,
      user: req.user.id,
    });

    todo.save().then((todo) => {
      res.send(todo);
    }).catch(e => {
      res.status(400).send(e);
    });
  });

Router
  .route('todos/:id')
  .get(auth, (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };

    Todo.findOne({
      id: id,
      user: req.user.id,
    }).then((todo) => {
      if(!todo) {
        res.status(404).send();
      };

      res.send({todo});
    }).catch(e => {
      res.status(400).send(e);
    });
  })
  .patch(auth, (req, res) => {

  })
  .delete(auth, (req, res) => {

  });

module.exports = Router;
