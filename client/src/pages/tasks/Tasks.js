import React, { useState } from 'react';
import { useTasks } from '../../api/useTasks';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

const Tasks = () => {
  const { tasks, loading, error, addTask, completeTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const taskData = {
      ...form,
      assignedBy: user.name,
      status: 'pending'
    };

    const result = await addTask(taskData);
    setSubmitting(false);
    
    if (result.success) {
      setShowModal(false);
      setForm({
        title: '',
        description: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
        category: 'general'
      });
    }
  };

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

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(task => task.status === filter);

  const userTasks = tasks.filter(task => task.assignedTo === user.name);

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Task Management</h1>
        <div className="content-actions">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Add New Task
          </button>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>📊 Total Tasks</h3>
          <p>Overview of all tasks in the system</p>
          <div className="summary-count">{tasks.length}</div>
        </div>
        <div className="dashboard-card">
          <h3>👤 My Tasks</h3>
          <p>Tasks assigned to you</p>
          <div className="summary-count">{userTasks.length}</div>
        </div>
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
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="dashboard-cards">
        {filteredTasks.length === 0 ? (
          <div className="content-container">
            <div className="text-center">
              <p className="text-gray">No tasks found.</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary mt-3">
                Create Your First Task
              </button>
            </div>
          </div>
        ) : (
          filteredTasks.map(task => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            const isOverdue = daysUntilDue < 0 && task.status !== 'completed';
            const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0 && task.status !== 'completed';

            return (
              <div key={task.id} className={`dashboard-card ${isOverdue ? 'overdue' : ''} ${isDueSoon ? 'due-soon' : ''}`}>
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
                      <span className="value">{task.assignedTo}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Assigned By:</span>
                      <span className="value">{task.assignedBy}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Category:</span>
                      <span className="value">{task.category}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Due Date:</span>
                      <span className={`value ${isOverdue ? 'text-red' : ''} ${isDueSoon ? 'text-orange' : ''}`}>
                        {task.dueDate}
                        {isOverdue && <span className="status red ml-2">OVERDUE</span>}
                        {isDueSoon && <span className="status orange ml-2">DUE SOON</span>}
                      </span>
                    </div>
                    {task.status === 'completed' && task.completedDate && (
                      <div className="info-row">
                        <span className="label">Completed:</span>
                        <span className="value">{new Date(task.completedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions">
                  {task.status !== 'completed' && (
                    <button 
                      onClick={() => handleComplete(task.id)}
                      className="btn btn-success"
                    >
                      Mark Complete
                    </button>
                  )}
                  {(user.role === 'Farm Manager' || user.role === 'Admin') && (
                    <button 
                      onClick={() => handleDelete(task.id)}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Task">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              id="title"
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignedTo">Assign To</label>
              <input
                id="assignedTo"
                type="text"
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="feeding">Feeding</option>
                <option value="cleaning">Cleaning</option>
                <option value="health">Health</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
