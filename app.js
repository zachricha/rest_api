require('dotenv').load();
require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const { userRoutes, todoRoutes } = require('./routes');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use(userRoutes, todoRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
