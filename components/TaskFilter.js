// components/TaskFilter.js
import React from 'react';

const TaskFilter = ({ setFilter, setCategoryFilter }) => {
  return (
    <div>
      <button onClick={() => { setFilter('all'); setCategoryFilter(''); }}>
        All Tasks
      </button>
      <button onClick={() => setFilter('completed')}>
        Completed Tasks
      </button>
      <button onClick={() => setFilter('incomplete')}>
        Incomplete Tasks
      </button>

      <div>
        <button onClick={() => setCategoryFilter('work')}>
          Work
        </button>
        <button onClick={() => setCategoryFilter('personal')}>
          Personal
        </button>
        <button onClick={() => setCategoryFilter('school')}>
          School
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;
