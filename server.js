import express from "express";
import cors from "cors";
import "dotenv/config";
import connect from "./libs/database.js";
import Todo from "./models/Todo.js";
import morgan from "morgan";

await connect();
const port = process.env.PORT;

// Initialize the app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).send("Failed to fetch todos");
  }
});

// Add a new Todo
app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo({ todo: req.body.name });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (err) {
    res.status(500).send("Failed to add Todo");
  }
});

// Delete a Todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.send("Todo deleted successfully");
  } catch (err) {
    res.status(500).send("Failed to delete Todo");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
