import React from 'react';
import './TaskFilter.css';

export default function TaskFilter({ currentFilter, setFilter, counts }) {
  const tabs = ['All', 'Active', 'Completed'];

  return (
    <div className="filters">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`filter-tab ${currentFilter === tab ? 'active' : ''}`}
          onClick={() => setFilter(tab)}
        >
          {tab}
          <span className="count-badge">{counts[tab]}</span>
        </button>
      ))}
    </div>
  );
}
