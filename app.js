require('dotenv').load();
const express = require('express');
const bodyParser = require('body-parser');

const { userRoutes, todoRoutes } = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(userRoutes, todoRoutes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
