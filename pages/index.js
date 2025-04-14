import { useState, useEffect } from "react";

export default function TodoApp() {
  // this state is for storing the list of tasks
  const [tasks, setTasks] = useState([]);
  // this state is for storing the input value of new task
  const [newTask, setNewTask] = useState("");
  // this state is for the quote
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
      // Try Quotable API first
      //let response = await fetch("https://api.quotable.io/random"); 
      
      {/* 
      IMPORTANT: This is the API above, im gonna try to find a stable one, but ive commented it out for now
      because it only sometimes works
      */}
        
      if (!response.ok) throw new Error('Primary API failed');
      
      const quoteData = await response.json();
      setQuote(`${quoteData.content}\n\n— ${quoteData.author || "Unknown"}`);
    } catch (firstError) {
      console.warn("Primary API failed, trying backup...", firstError);
      
      try {
        // this tries to pull the API quote, if theres an internal error with the API, it goes to the second choice.
        
        /* HEADS UP: I've tried 4 different "inspirational quote API's", and all are volatile. I added a local cache
           just in case because they will not likely work - Steven
        */
        const backupResponse = await fetch("https://api.quotable.io/random");
        const quotes = await backupResponse.json();
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(`${randomQuote.text}\n\n— ${randomQuote.author || "Unknown"}`);
      } catch (secondError) {
        console.warn("Backup API failed, using hardcoded quotes", secondError);
        
        // here's a localized cache of quotes. If the API is broken, it uses these.
        const localQuotes = [
          { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
          { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
          { content: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
          { content: "If you can do what you do best and be happy, you are further along in life than most people.", author: "Leonardo DiCaprio" },
          { content: "Success is falling nine times and getting up 10.", author: "Jon Bon Jovi" },
          { content: "If you don’t like the road you’re walking, start paving another one.", author: "Dolly Parton" }
        ];
        const randomLocal = localQuotes[Math.floor(Math.random() * localQuotes.length)];
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

      <div className="quote">
        {quote === "Loading inspirational quote..." ? (
          <div>Loading quote...</div>
        ) : (
          quote.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))
        )}
      </div>
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

        .quote {
          margin-top: 30px;
          font-style: italic;
          color: #fff3f2;
          white-space: pre-line;
        }
      `}</style>
    </div>
  );
}
