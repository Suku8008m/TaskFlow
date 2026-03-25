import React, { useEffect, useState, useReducer } from 'react';
import { FiMoon, FiSun, FiBookOpen, FiSidebar, FiCalendar, FiClock, FiList } from 'react-icons/fi';
import { taskReducer, initialState } from './reducers/taskReducer';
import TaskInput from './components/TaskInput';
import TaskFilter from './components/TaskFilter';
import TaskList from './components/TaskList';
import EmptyState from './components/EmptyState';
import './App.css';

export default function App() {
  const [tasks, dispatch] = useReducer(taskReducer, initialState);
  const [theme, setTheme] = useState('dark');
  const [filter, setFilter] = useState('All');
  const [sidebarFilter, setSidebarFilter] = useState('AllTasks');
  const [category, setCategory] = useState('Personal');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Intelligently check screen size on mount
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    dispatch({ type: 'INIT', payload: savedTasks });
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAddTask = (taskData) => {
    if (!taskData.text.trim()) return;
    dispatch({ type: 'ADD_TASK', payload: taskData });
  };

  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  // Sidebar Navigation logic
  let navigatedTasks = tasks.filter(t => {
    if (sidebarFilter === 'Recent') {
      return (Date.now() - t.createdAt) < ONE_DAY;
    }
    if (sidebarFilter === 'Upcoming') {
      // Show tasks with a valid due date that are not completed yet
      if (!t.dueDate) return false;
      const dueStr = new Date(t.dueDate).getTime();
      const nowStr = new Date().setHours(0,0,0,0);
      return dueStr >= nowStr && !t.completed;
    }
    return true; // AllTasks
  });

  // Top Tabs filter logic
  const filteredTasks = navigatedTasks.filter(task => {
    if (filter === 'Active') return !task.completed;
    if (filter === 'Completed') return task.completed;
    return true;
  });

  const activeCount = navigatedTasks.filter(t => !t.completed).length;
  const completedCount = navigatedTasks.filter(t => t.completed).length;

  const handleNavClick = (nav) => {
    setSidebarFilter(nav);
    setFilter('All'); // Reset top tab filter when navigating sidebar
    if (window.innerWidth <= 768) setIsSidebarOpen(false); // Map Mobile interactions well
  };

  return (
    <div className="layout">
      {/* Mobile Overlay */}
      {isSidebarOpen && window.innerWidth <= 768 && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiBookOpen className="text-primary" />
            <span>TaskFlow</span>
          </div>
          <button className="icon-btn" onClick={() => setIsSidebarOpen(false)} aria-label="Close sidebar">
            <FiSidebar />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <p className="nav-group-title">Menu</p>
          <button 
            className={`nav-item ${sidebarFilter === 'AllTasks' ? 'active' : ''}`} 
            onClick={() => handleNavClick('AllTasks')}
          >
            <FiList /> All Tasks
          </button>
          
          <button 
            className={`nav-item ${sidebarFilter === 'Recent' ? 'active' : ''}`} 
            onClick={() => handleNavClick('Recent')}
          >
            <FiCalendar /> Recently Added
          </button>
          
          <button 
            className={`nav-item ${sidebarFilter === 'Upcoming' ? 'active' : ''}`} 
            onClick={() => handleNavClick('Upcoming')}
          >
            <FiClock /> Upcoming
          </button>
          
          <p className="nav-group-title mt-top">Categories</p>
          <div className="sidebar-category">
            <span className="dot bg-blue"></span> Work
          </div>
          <div className="sidebar-category">
            <span className="dot bg-green"></span> Personal
          </div>
          <div className="sidebar-category">
            <span className="dot bg-orange"></span> Urgent
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-bar">
          <div className="top-bar-left">
            {!isSidebarOpen && (
              <button className="icon-btn toggle-sidebar-btn" onClick={() => setIsSidebarOpen(true)} aria-label="Open sidebar">
                <FiSidebar />
              </button>
            )}
          </div>
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
            {theme === 'dark' ? <FiMoon /> : <FiSun />}
          </button>
        </header>

        <main className="app-container">
          <header className="header">
            <div className="header-title">
              <div className="icon-wrapper primary"><FiBookOpen size={24} /></div>
              <div>
                <h1>{sidebarFilter === 'AllTasks' ? 'Tasks' : sidebarFilter === 'Recent' ? 'Recently Added' : 'Upcoming Tasks'}</h1>
                <p className="subtitle">{activeCount} active, {completedCount} completed</p>
              </div>
            </div>
          </header>

          <TaskInput onAdd={handleAddTask} category={category} setCategory={setCategory} />
          
          <TaskFilter 
            currentFilter={filter} 
            setFilter={setFilter} 
            counts={{
              All: navigatedTasks.length,
              Active: activeCount,
              Completed: completedCount
            }}
          />

          {filteredTasks.length > 0 ? (
            <TaskList tasks={filteredTasks} dispatch={dispatch} />
          ) : (
            <EmptyState filter={filter} />
          )}
        </main>
      </div>
    </div>
  );
}
