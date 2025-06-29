import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../../api/useTasks';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Tasks.module.css';

const AddTask = () => {
  const { addTask, fetchWorkers } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    category: 'general'
  });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWorkers = async () => {
      const workersList = await fetchWorkers();
      setWorkers(workersList);
    };
    loadWorkers();
  }, [fetchWorkers]);

  // Check if user is a farm manager
  if (user.role !== 'Farm Manager') {
    return (
      <div className="dashboard-container">
        <div className="content-header">
          <h1 className="content-title">Access Denied</h1>
        </div>
        <div className="content-container">
          <p>Only farm managers can add new tasks.</p>
          <button onClick={() => navigate('/tasks')} className="btn btn-secondary">
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Find the worker by name to get their user ID
    const selectedWorker = workers.find(worker => worker.name === form.assignedTo);
    if (!selectedWorker) {
      setError('Please select a valid worker');
      setLoading(false);
      return;
    }

    const taskData = {
      title: form.title,
      description: form.description,
      assigned_to: selectedWorker.id, // Send user ID, not name
      assigned_by: user.user_id, // Send user ID, not name
      priority: form.priority,
      category: form.category,
      status: 'pending',
      due_date: form.dueDate
    };

    const result = await addTask(taskData);
    setLoading(false);

    if (result.success) {
      navigate('/tasks');
    } else {
      setError(result.error || 'Failed to add task');
    }
  };

  return (
    <div className="task-form-container">
      <div className="content-header">
        <h1 className="content-title">Add New Task</h1>
        <p className="content-subtitle">Create a new task for the cattle management system</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            placeholder="Provide detailed description of the task"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignedTo">Assign To *</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select a worker</option>
              {workers.map((worker) => (
                <option key={worker.id} value={worker.name}>
                  {worker.name}
                </option>
              ))}
            </select>
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
            <label htmlFor="dueDate">Due Date *</label>
            <input
              id="dueDate"
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
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
              <option value="milking">Milking</option>
              <option value="breeding">Breeding</option>
              <option value="transport">Transport</option>
            </select>
          </div>
        </div>

        <div className="form-info">
          <p><strong>Task Details:</strong></p>
          <ul>
            <li>This task will be assigned by: <strong>{user.name}</strong></li>
            <li>Initial status will be set to: <strong>Pending</strong></li>
            <li>You can update the status later from the tasks list</li>
          </ul>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/tasks')} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Adding Task...' : 'Add Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask; 