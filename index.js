import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://new-todo-app-swart.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


let alltodos = [];

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Get Todos
app.get("/gettodos", (req, res) => {
  res.json({
    success: true,
    todos: alltodos,
  });
});

// Add Todo
app.post("/addtodo", (req, res) => {
  const {
    title,
    description,
    priority,
    completed,
    createdAt,
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and Description required",
    });
  }

  const todo = {
    id: uuidv4(),
    title,
    description,
    priority: priority || "Medium",
    completed: completed || false,
    createdAt: createdAt || new Date().toLocaleString(),
  };

  alltodos.push(todo);

  res.status(201).json({
    success: true,
    todo,
    todos: alltodos,
  });
});

// Get One Todo
app.get("/gettodo/:id", (req, res) => {
  const todo = alltodos.find((t) => t.id === req.params.id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  res.json({
    success: true,
    todo,
  });
});

// Edit Todo
app.put("/edittodo/:id", (req, res) => {
  const todo = alltodos.find((t) => t.id === req.params.id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  const {
    title,
    description,
    priority,
    completed,
  } = req.body;

  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (priority !== undefined) todo.priority = priority;
  if (completed !== undefined) todo.completed = completed;

  res.json({
    success: true,
    todo,
  });
});

// Delete Todo
app.delete("/deletetodo/:id", (req, res) => {
  const index = alltodos.findIndex((t) => t.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Todo not found",
    });
  }

  const deleted = alltodos.splice(index, 1);

  res.json({
    success: true,
    todo: deleted[0],
    todos: alltodos,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});