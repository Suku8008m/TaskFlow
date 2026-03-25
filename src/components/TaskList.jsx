import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

export default function TaskList({ tasks, dispatch }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} dispatch={dispatch} />
      ))}
    </div>
  );
}
