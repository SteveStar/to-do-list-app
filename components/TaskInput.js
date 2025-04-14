// components/TaskInput.js
import React, { useState } from 'react';

const TaskInput = ({ addTask }) => {
  const [task, setTask] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task && category) {
      // Generate a unique id for each task (using Date.now() for simplicity)
      const newTask = {
        id: Date.now(),  // Ensure each task has a unique ID
        text: task,
        dueDate,
        category,
        completed: false,
      };
      addTask(newTask);
      setTask('');
      setDueDate('');
      setCategory('');
    } else {
      alert("Please enter a task and select a category.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="school">School</option>
      </select>
      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskInput;
