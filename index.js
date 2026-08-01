import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();

const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

const alltodos = [];

// Home Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Get All Todos
app.get("/gettodos", (req, res) => {
  res.status(200).json({
    success: true,
    todos: alltodos,
  });
});

// Get Single Todo
app.get("/gettodo/:id", (req, res) => {
  const { id } = req.params;

  const todo = alltodos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.status(200).json({
    success: true,
    todo,
  });
});

// Add Todo
app.post("/addtodo", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and Description are required",
    });
  }

  const newTodo = {
    id: uuidv4(),
    title,
    description,
  };

  alltodos.push(newTodo);

  res.status(201).json({
    success: true,
    message: "Todo added successfully",
    todo: newTodo,
    todos: alltodos,
  });
});

// Edit Todo
app.put("/edittodo/:id", (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const todo = alltodos.find((todo) => todo.id === id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

if (title !== undefined) {
  todo.title = title;
}

if (description !== undefined) {
  todo.description = description;
}

  res.status(200).json({
    success: true,
    message: "Todo updated successfully",
    todo,
  });
});

// Delete Todo
app.delete("/deletetodo/:id", (req, res) => {
  const { id } = req.params;

  const index = alltodos.findIndex((todo) => todo.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  const deletedTodo = alltodos.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Todo deleted successfully",
    todo: deletedTodo[0],
    todos: alltodos,
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});