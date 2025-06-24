import React, { useState } from 'react';
import { useTasks } from '../../api/useTasks';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import '../../styles/Tasks.module.css';

const Checklist = () => {
  const { tasks, loading, error, completeTask } = useTasks();
  const { user } = useAuth();
  const [filter, setFilter] = useState('pending');

  const handleComplete = async (taskId) => {
    await completeTask(taskId);
  };

  const userTasks = tasks.filter(task => task.assignedTo === user.name);
  const filteredTasks = filter === 'all' 
    ? userTasks 
    : userTasks.filter(task => task.status === filter);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="checklist-container">
      <div className="page-header">
        <h2>My Task Checklist</h2>
        <div className="checklist-summary">
          <span className="summary-item">
            Total: <strong>{userTasks.length}</strong>
          </span>
          <span className="summary-item">
            Completed: <strong className="green">{userTasks.filter(t => t.status === 'completed').length}</strong>
          </span>
          <span className="summary-item">
            Pending: <strong className="red">{userTasks.filter(t => t.status === 'pending').length}</strong>
          </span>
        </div>
      </div>

      <div className="checklist-filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending Tasks</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="all">All Tasks</option>
        </select>
      </div>

      <div className="checklist-list">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found for the selected filter.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0 && task.status !== 'completed';
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && task.status !== 'completed';

            return (
              <div key={task.id} className={`checklist-item ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''} ${task.status === 'completed' ? 'completed' : ''}`}>
                <div className="checklist-header">
                  <div className="task-info">
                    <h3>{task.title}</h3>
                    <div className="task-meta">
                      <span className={`priority ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="category">{task.category}</span>
                      {isOverdue && <span className="overdue-badge">OVERDUE</span>}
                      {isDueSoon && !isOverdue && <span className="due-soon-badge">DUE SOON</span>}
                    </div>
                  </div>
                  <div className="task-status">
                    {task.status === 'completed' ? (
                      <span className="status-completed">✅ Completed</span>
                    ) : (
                      <button 
                        onClick={() => handleComplete(task.id)}
                        className="btn btn-success"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>

                <div className="checklist-content">
                  <p className="task-description">{task.description}</p>
                  <div className="task-details">
                    <div className="detail-row">
                      <span className="label">Assigned By:</span>
                      <span className="value">{task.assignedBy}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Due Date:</span>
                      <span className={`value ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''}`}>
                        {task.dueDate}
                      </span>
                    </div>
                    {task.status === 'completed' && task.completedDate && (
                      <div className="detail-row">
                        <span className="label">Completed:</span>
                        <span className="value">{new Date(task.completedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="checklist-instructions">
        <h3>Instructions</h3>
        <ul>
          <li>Review your assigned tasks and mark them as complete when finished</li>
          <li>Pay attention to due dates and priority levels</li>
          <li>Contact your manager if you need help with any task</li>
          <li>Update task status regularly to keep everyone informed</li>
        </ul>
      </div>
    </div>
  );
};

export default Checklist;
