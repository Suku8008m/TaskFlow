import React, { useState } from 'react';
import { FiPlus, FiCalendar } from 'react-icons/fi';
import './TaskInput.css';

const categories = [
  { name: 'Work', color: 'blue' },
  { name: 'Personal', color: 'green' },
  { name: 'Urgent', color: 'orange' }
];

export default function TaskInput({ onAdd, category, setCategory }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ text, category, dueDate });
    setText('');
    setDueDate('');
  };

  return (
    <div className="task-input-section">
      <form onSubmit={handleSubmit} className="task-input-form-wrapper">
        <div className="task-input-form">
          <button type="submit" className="add-btn" disabled={!text.trim()} aria-label="Add task">
            <FiPlus />
          </button>
          <input 
            type="text" 
            placeholder="Add a new task..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="task-input"
          />
        </div>
        
        <div className="task-extras">
          <div className="category-selector">
            <span className="category-label">Category:</span>
            {categories.map(c => (
              <button
                key={c.name}
                className={`category-pill ${category === c.name ? 'active' : ''}`}
                onClick={() => setCategory(c.name)}
                type="button"
              >
                <span className={`dot bg-${c.color}`}></span>
                {c.name}
              </button>
            ))}
          </div>
          
          <div className="due-date-selector">
            <FiCalendar className="date-icon" />
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              className="date-input" 
            />
          </div>
        </div>
      </form>
    </div>
  );
}
