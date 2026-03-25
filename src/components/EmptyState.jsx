import React from 'react';
import { FiClipboard } from 'react-icons/fi';
import './EmptyState.css';

export default function EmptyState({ filter }) {
  const messages = {
    All: { title: "No tasks yet", subtitle: "Add your first task to get started on your productivity journey!" },
    Active: { title: "No active tasks", subtitle: "You are all caught up!" },
    Completed: { title: "No completed tasks", subtitle: "Complete a task to see it here." }
  };

  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <FiClipboard size={32} />
        <span className="sparkles">✨</span>
      </div>
      <h3>{messages[filter].title}</h3>
      <p>{messages[filter].subtitle}</p>
    </div>
  );
}
