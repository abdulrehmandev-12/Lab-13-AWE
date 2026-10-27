const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

let nextId = 3;
let todos = [
  { id: 1, task: 'Learn Express.js', completed: false },
  { id: 2, task: 'Build a Full-Stack App', completed: false },
];

app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

app.post('/todos', (req, res) => {
  const task = typeof req.body.task === 'string' ? req.body.task.trim() : '';

  if (!task) {
    return res.status(400).json({ message: 'Task is required.' });
  }

  const duplicate = todos.some(
    (todo) => todo.task.toLowerCase() === task.toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ message: 'This task already exists.' });
  }

  const newTodo = { id: nextId++, task, completed: false };
  todos.push(newTodo);
  return res.status(201).json({
    message: 'Task created successfully.',
    todo: newTodo,
  });
});

app.put('/todos/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ message: 'To-Do not found.' });
  }

  const { task, completed } = req.body;
  if (task !== undefined) {
    if (typeof task !== 'string' || !task.trim()) {
      return res.status(400).json({ message: 'Task must be a non-empty string.' });
    }
    todo.task = task.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'Completed must be a boolean.' });
    }
    todo.completed = completed;
  }

  return res.status(200).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const exists = todos.some((item) => item.id === id);
  if (!exists) {
    return res.status(404).json({ message: 'To-Do not found.' });
  }
  todos = todos.filter((item) => item.id !== id);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
