const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const username = request.header("username");
  const user = users.find((user) => user.username === username);
  if (!user) return response.status(404).end({ message: "User not found" });
  request.user = user;
  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  if (users.some((user) => user.username === username)) {
    return response.status(400).json({ message: "User already exists" });
  }
  const user = {
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: [],
  };
  users.push(user);
  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  // const todos = users.find((user) => user.username === username).todos;
  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const todo_id = request.params.id;
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = user.todos.find((todo) => todo.id === todo_id);

  if (!todo) return response.status(404).json({ message: "Todo inexistente" });

  (todo.title = title), (todo.deadline = deadline);

  return response.status(201).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const todo_id = request.params.id;
  const { user } = request;

  const todo = user.todos.find((todo) => todo.id === todo_id);

  if (!todo) return response.status(404).json({ message: "Todo inexistente" });

  todo.done = true;

  return response.status(201).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const todo_id = request.params.id;
  const { user } = request;

  const todoIndex = user.todos.findIndex((todo) => todo.id === todo_id);

  if (todoIndex < 0)
    return response.status(404).json({ message: "Todo inexistente" });

  user.todos.splice(todoIndex, 1);

  return response.status(204).end();
});

module.exports = app;
