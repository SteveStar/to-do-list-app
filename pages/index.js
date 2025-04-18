import { useState, useEffect } from "react";

export default function TodoApp() {
  // state for storing the list of tasks
  const [tasks, setTasks] = useState([]);
  // state for storing the input value of a new task
  const [newTask, setNewTask] = useState("");
  // state for filtering tasks (all, completed, or incomplete)
  const [filter, setFilter] = useState("all");
  // state for storing the quote
  const [quote, setQuote] = useState("Loading inspirational quote...");

  // load tasks from local storage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
    fetchRandomQuote();
  }, []);

  // func to fetch a random quote
  const fetchRandomQuote = async () => {
    try {
      const response = await fetch("https://api.quotable.io/random");
      if (!response.ok) throw new Error("Primary API failed");

      const quoteData = await response.json();
      setQuote(`${quoteData.content}\n\n— ${quoteData.author || "Unknown"}`);
    } catch (firstError) {
      console.warn("Primary API failed, trying backup...", firstError);

      try {
        // this tries to pull the API quote, if there's an internal error with the API, it goes to the second choice.
        const backupResponse = await fetch("https://api.quotable.io/random");
        const quotes = await backupResponse.json();
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(`${randomQuote.text}\n\n— ${randomQuote.author || "Unknown"}`);
      } catch (secondError) {
        console.warn("Backup API failed, using hardcoded quotes", secondError);

        // here's a localized cache of quotes. If the API is broken, it uses these.
        const localQuotes = [
          {
            content: "The only way to do great work is to love what you do.",
            author: "Steve Jobs",
          },
          {
            content: "Life is what happens when you're busy making other plans.",
            author: "John Lennon",
          },
          {
            content: "The journey of a thousand miles begins with one step.",
            author: "Lao Tzu",
          },
          {
            content:
              "If you can do what you do best and be happy, you are further along in life than most people.",
            author: "Leonardo DiCaprio",
          },
          {
            content: "Success is falling nine times and getting up 10.",
            author: "Jon Bon Jovi",
          },
          {
            content:
              "If you don’t like the road you’re walking, start paving another one.",
            author: "Dolly Parton",
          },
        ];
        const randomLocal =
          localQuotes[Math.floor(Math.random() * localQuotes.length)];
        setQuote(`${randomLocal.content}\n\n— ${randomLocal.author}`);
      }
    }
  };

  // save the tasks to local storage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // func to add a new task to the list
  const addTask = () => {
    if (newTask.trim() !== "") {
      const updatedTasks = [
        ...tasks,
        { id: Date.now(), text: newTask, completed: false },
      ];
      setTasks(updatedTasks);
      setNewTask(""); // clear input field after adding task
    }
  };

  // func to toggle the completion status of a task
  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // func to delete a task from the list
  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // filter tasks based on current filter state
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) =>
          filter === "completed" ? task.completed : !task.completed
        );

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div>
        {/* input field to enter a new task */}
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        {/* button to add the task to the list */}
        <button onClick={addTask}>Add</button>
      </div>

      <div className="filters">
        {/* button to view all tasks */}
        <button onClick={() => setFilter("all")}>All Tasks</button>
        {/* button to view only completed tasks */}
        <button onClick={() => setFilter("completed")}>Completed Tasks</button>
        {/* button to view only incomplete tasks */}
        <button onClick={() => setFilter("incomplete")}>
          Incomplete Tasks
        </button>
      </div>

      <ul>
        {/* render filtered tasks */}
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              <span onClick={() => toggleTask(task.id)}>{task.text}</span>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          ))
        ) : (
          <li>No tasks to show</li>
        )}
      </ul>

      <div className="quote">
        {/* render the quote with line breaks */}
        {quote.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>

      <style jsx>{`
        .container {
          text-align: center;
          max-width: 400px;
          margin: auto;
          padding: 20px;
          margin-top: 20px;
          border: 1px solid white;
          border-radius: 10px;
          color: #d9e9ff;
          background-color: #151a2b;
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
          background-color: #151a2b;
          border-color: rgb(54, 75, 104);
          padding: 5px;
          cursor: pointer;
        }

        .filters {
          margin: 10px 0;
        }

        .filters button {
          margin-right: 5px;
        }

        .quote {
          margin-top: 30px;
          font-style: italic;
          color: #d9e9ff;
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
}
