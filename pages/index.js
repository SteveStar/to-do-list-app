import { useState, useEffect } from "react";

export default function TodoApp() {
  // this state is for storing the list of tasks
  const [tasks, setTasks] = useState([]);
  // this state is for storing the input value of new task
  const [newTask, setNewTask] = useState("");

  // load tasks from local storage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // save the tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // func to add a new task to the list
  const addTask = () => {
    if (newTask.trim() !== "") {
      const updatedTasks = [...tasks, { id: Date.now(), text: newTask, completed: false }];
      setTasks(updatedTasks);
      setNewTask(""); // clear input field after adding task
    }
  };

  // func to toggle the completion status of a task
  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    setTasks(updatedTasks);
  };

  // func to delete a task from the list
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div>
        {/* the input field to enter a new task */}
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="add a new task" 
        />
        {/* button to add the task to the list */}
        <button onClick={addTask}>add</button>
      </div>
      <ul>
        {/* rendering the list of tasks */}
        {tasks.map(task => (
          <li key={task.id} className={task.completed ? "completed" : ""}>
            {/* clicking the task toggles its completion status */}
            <span onClick={() => toggleTask(task.id)}>{task.text}</span>
            {/* button to delete the task */}
            <button onClick={() => deleteTask(task.id)}>delete</button>
          </li>
        ))}
      </ul>
      {/* take sylings and put them in independent file later */}
      <style jsx>{`
        .container {
          text-align: center;
          max-width: 400px;
          margin: auto;
          padding: 20px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          border-bottom: 1px solid #ccc;
        }
        .completed {
          text-decoration: line-through;
          color: gray;
        }
        button {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
}
