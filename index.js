import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app = express();
// app.use(cors());
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
    process.env.FRONTEND_URL,
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
const alltodos = [
  {
    title: "First Todo",
    description:
      "this is my first todo",
    id: 1,
  },
];

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// add todo

app.post("/addtodo", (req, res) => {
  const { title, description } = req.body;
  alltodos.push({
    title,
    description,
    id: Date.now(),
  });
  res.status(201).json({
    message: "Todo added successfully",
    todos: alltodos,
  });
});

// get all todos

app.get("/gettodos", (req, res) => {
  res.json({ todos: alltodos });
});

// get single todo

app.get("/gettodo/:id", (req, res) => {
  const { id } = req.params;
  const todoIndex = alltodos.findIndex((todo) => todo.id === +id);
  console.log("api running");
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({ todo: alltodos[todoIndex] });
});

// delete todo

app.delete("/deletetodo/:id", (req, res) => {
  const { id } = req.params;
  const todoIndex = alltodos.findIndex((todo) => todo.id === +id);
  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }
  alltodos.splice(todoIndex, 1);
  res.json({ message: "Todo deleted successfully" });
});

// edit todo

app.put("/edittodo/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const todoIndex = alltodos.findIndex((todo) => todo.id === +id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  alltodos[todoIndex].title = title;
  res.json({ message: "Todo updated successfully", todo: alltodos[todoIndex] });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});