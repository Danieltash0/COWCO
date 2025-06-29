import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../api/useTasks';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const Tasks = () => {
  const { tasks, loading, error, completeTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const handleComplete = async (taskId) => {
    await completeTask(taskId);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'orange';
      case 'pending': return 'red';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const userTasks = tasks.filter(task => task.assigned_to === user.user_id);

  const filteredTasks = filter === 'all' 
    ? (user.role === 'Worker' ? userTasks : tasks)
    : (user.role === 'Worker' ? userTasks.filter(task => task.status === filter) : tasks.filter(task => task.status === filter));

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Task Management</h1>
        <div className="content-actions">
          {user.role === 'Farm Manager' && (
            <button onClick={() => navigate('/tasks/add')} className="btn btn-primary">
              Add New Task
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📊 Total Tasks</h3>
          <p>Overview of all tasks in the system</p>
          <div className="summary-count">{tasks.length}</div>
        </div>
        {user.role === 'Worker' && (
          <div className="dashboard-card">
            <h3>👤 My Tasks</h3>
            <p>Tasks assigned to you</p>
            <div className="summary-count">{userTasks.length}</div>
          </div>
        )}
        <div className="dashboard-card">
          <h3>✅ Completed</h3>
          <p>Successfully completed tasks</p>
          <div className="summary-count text-green">
            {tasks.filter(task => task.status === 'completed').length}
          </div>
        </div>
        <div className="dashboard-card">
          <h3>⏳ Pending</h3>
          <p>Tasks awaiting completion</p>
          <div className="summary-count text-red">
            {tasks.filter(task => task.status === 'pending').length}
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="form-group">
          <label htmlFor="filter">Filter Tasks</label>
          <select 
            id="filter"
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="dashboard-cards">
        {filteredTasks.length === 0 ? (
          <div className="content-container">
            <div className="text-center">
              <p className="text-gray">No tasks found.</p>
              {user.role === 'Farm Manager' && (
                <button onClick={() => navigate('/tasks/add')} className="btn btn-primary mt-3">
                  Create Your First Task
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredTasks.map(task => {
            const dueDate = new Date(task.due_date);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0 && task.status !== 'completed';
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && task.status !== 'completed';

            return (
              <div key={task.task_id} className={`dashboard-card ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''}`}>
                <div className="card-header">
                  <h3 className="card-title">{task.title}</h3>
                  <div className="task-meta">
                    <span className={`status ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`status ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>

                <div className="task-content">
                  <p className="task-description">{task.description}</p>
                  <div className="cattle-info">
                    <div className="info-row">
                      <span className="label">Assigned To:</span>
                      <span className="value">{task.assigned_to_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Assigned By:</span>
                      <span className="value">{task.assigned_by_name}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Category:</span>
                      <span className="value">{task.category}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Due Date:</span>
                      <span className={`value ${isOverdue ? 'text-red' : ''} ${isDueSoon ? 'text-orange' : ''}`}>
                        {new Date(task.due_date).toLocaleDateString()}
                        {isOverdue && <span className="status red ml-2">OVERDUE</span>}
                        {isDueSoon && <span className="status orange ml-2">DUE SOON</span>}
                      </span>
                    </div>
                    {task.status === 'completed' && task.completed_date && (
                      <div className="info-row">
                        <span className="label">Completed:</span>
                        <span className="value">{new Date(task.completed_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  {task.status !== 'completed' && (
                    <button 
                      onClick={() => handleComplete(task.task_id)}
                      className="btn btn-success"
                    >
                      Mark Complete
                    </button>
                  )}
                  {(user.role === 'Farm Manager' || user.role === 'Admin') && (
                    <button 
                      onClick={() => handleDelete(task.task_id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Tasks;
