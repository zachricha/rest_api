const express = require('express');
const {ObjectID} = require('mongodb');

const { User, Todo } = require('../models');
const auth = require('../middleware/auth');

const Router = express.Router();

Router
  .route('/todos')
  .get(auth, (req, res) => {
    Todo.find({
      user: req.user.id,
    }).then((todos) => {
      return res.send({todos});
    }).catch(e => {
      res.status(400).send(e);
    });
  })
  .post(auth, (req, res) => {
    const todo = new Todo({
      text: req.body.text,
      user: req.user.id,
    });

    todo.save().then((todo) => {
      return res.send(todo);
    }).catch(e => {
      return res.status(400).send(e);
    });
  });

Router
  .route('/todos/:id')
  .get(auth, (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };

    Todo.findOne({
      _id: id,
      user: req.user.id,
    }).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      };

      return res.send(todo);
    }).catch(e => {
      return res.status(400).send(e);
    });
  })
  .patch(auth, (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };

    if(typeof req.body.completed === 'boolean' && req.body.completed) {
      req.body.completedAt = new Date().getTime();
    } else {
      req.body.completed = false;
      req.body.completedAt = null;
    };

    Todo.findOneAndUpdate({_id: id, user: req.user.id}, {$set: req.body}, {new: true}).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      };

      return res.send(todo);
    }).catch(e => {
      return res.status(400).send(e);
    });
  })
  .delete(auth, (req, res) => {
    const id = req.params.id;

    if(!ObjectID.isValid(id)) {
      return res.status(404).send();
    };

    Todo.findOneAndRemove({_id: id, user: req.user.id}).then((todo) => {
      if(!todo) {
        return res.status(404).send();
      };

      res.send(todo);
    }).catch(e => {
      return res.status(400).send(e);
    });
  });

module.exports = Router;
