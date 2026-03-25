import React, { useState, useRef, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiCalendar } from 'react-icons/fi';
import './TaskItem.css';

const categoryColors = {
  Work: 'blue',
  Personal: 'green',
  Urgent: 'orange'
};

export default function TaskItem({ task, dispatch }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isExiting, setIsExiting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDelete = () => {
    setIsExiting(true);
    setTimeout(() => {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
    }, 300);
  };

  const handleSave = () => {
    if (editText.trim() !== '') {
      dispatch({ type: 'EDIT_TASK', payload: { id: task.id, text: editText } });
    } else {
      setEditText(task.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditText(task.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isExiting ? 'exiting' : ''}`}>
      <div className="checkbox-container">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
          id={`task-${task.id}`}
          className="custom-checkbox"
        />
        <label htmlFor={`task-${task.id}`} className="checkbox-visual">
          {task.completed && <FiCheck size={12} />}
        </label>
      </div>
      
      <div className="task-content">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span 
            className="task-text" 
            onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
            onDoubleClick={() => setIsEditing(true)}
            style={{ cursor: 'pointer' }}
          >
            {task.text}
          </span>
        )}
        <div className="task-metadata">
          <span className={`task-category text-${categoryColors[task.category]}`}>
            {task.category}
          </span>
          {task.dueDate && (
            <span className="task-date">
              <FiCalendar size={10} style={{marginRight: '4px', verticalAlign: 'middle'}}/>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => setIsEditing(!isEditing)} className="action-btn edit" aria-label="Edit task">
          <FiEdit2 size={16} />
        </button>
        <button onClick={handleDelete} className="action-btn delete" aria-label="Delete task">
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}
