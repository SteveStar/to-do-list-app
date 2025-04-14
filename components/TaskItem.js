// components/TaskItem.js
import React from 'react';

const TaskItem = ({ task, category, completed, onComplete }) => {
  return (
    <div>
      <span style={completed ? { textDecoration: 'line-through', color: '#777' } : {}}>
        {task}
      </span>
      <span> ({category})</span>
      <button onClick={onComplete}>
        {completed ? 'Completed' : 'Complete'}
      </button>
    </div>
  );
};

export default TaskItem;
