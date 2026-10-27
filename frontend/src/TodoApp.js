import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/todos';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
      setError('');
    } catch {
      setError('Could not connect to the API. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (!task.trim()) {
      setError('Please enter a task before adding it.');
      return;
    }
    try {
      const response = await axios.post(API_URL, { task });
      const createdTodo = response.data.todo;
      setTodos((current) => [...current, createdTodo]);
      setTask('');
      setError('');
    } catch (err) {
      if (err.response?.status === 409) {
        setError(err.response.data.message || 'This task already exists.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Please enter a valid task.');
      } else {
        setError('Unable to add task. Please try again.');
      }
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo.id}`, {
        completed: !todo.completed,
      });
      setTodos((current) =>
        current.map((item) => item.id === todo.id ? response.data : item)
      );
      setError('');
    } catch {
      setError('Unable to update task. Please try again.');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos((current) => current.filter((todo) => todo.id !== id));
      setError('');
    } catch {
      setError('Unable to delete task. Please try again.');
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <main className="page-shell">
      <section className="todo-card">
        <div className="eyebrow">23FA-012-ST</div>
        <h1>Campus Task Board</h1>
        <p className="subtitle">A simple full-stack To-Do app powered by React and Express.</p>

        <div className="stats">
          <div><strong>{todos.length}</strong><span>Total tasks</span></div>
          <div><strong>{completedCount}</strong><span>Completed</span></div>
          <div><strong>{todos.length - completedCount}</strong><span>Remaining</span></div>
        </div>

        <form className="add-form" onSubmit={handleAddTodo}>
          <label className="sr-only" htmlFor="new-task">New task</label>
          <input id="new-task" value={task} onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to get done?" />
          <button type="submit">+ Add task</button>
        </form>

        {error && <div className="error-message" role="alert">{error}</div>}

        <div className="list-heading">
          <h2>Your tasks</h2><span>{todos.length} items</span>
        </div>

        {loading ? <p className="empty-state">Loading tasks…</p> :
          todos.length === 0 ? <p className="empty-state">No tasks yet. Add one above.</p> :
          <ul className="todo-list">
            {todos.map((todo) => (
              <li className={`todo-item ${todo.completed ? 'is-complete' : ''}`} key={todo.id}>
                <button className={`check-button ${todo.completed ? 'checked' : ''}`}
                  onClick={() => handleToggleComplete(todo)} aria-label="Toggle task completion">
                  {todo.completed ? '✓' : ''}
                </button>
                <span className="task-label">{todo.task}</span>
                <button className="delete-button" onClick={() => handleDeleteTodo(todo.id)}
                  aria-label={`Delete ${todo.task}`}>Delete</button>
              </li>
            ))}
          </ul>
        }
        <footer>React frontend <span>•</span> Express REST API <span>•</span> In-memory storage</footer>
      </section>
    </main>
  );
}
