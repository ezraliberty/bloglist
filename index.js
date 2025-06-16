require("express-async-errors");
const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/author");
const listRouter = require('./controllers/readingList')

app.use(express.json());
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);
app.use("/api/readinglists", listRouter);

const errorHandler = (error, request, response, next) => {
  console.error(error);
  console.error(error.name);
  console.error(error.message);

  switch (error.name) {
    case "TypeError":
      return response.status(400).send({ error: "bad request" });

    case "SequelizeValidationError":
      return response.status(400).send({ error: error.errors[0].message });

    default:
      return response.status(500).send({ error: "internal server error" });
  }
  // if (error.name === 'TypeError') {
  //   return response.status(400).send({error: 'bad request'})
  // }
  // if (error.name === 'SequelizeValidationError') {
  //   return response.status(400).send({error: 'malformatted request'})
  // }

  next(error);
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
