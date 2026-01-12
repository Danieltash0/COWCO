import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../api/useTasks';
import { useAdmin } from '../../api/useAdmin';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const AddTask = () => {
  const { user } = useAuth();
  const { addTask } = useTasks();
  const { users } = useAdmin();
  const navigate = useNavigate();
  
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general',
    assigned_to: '',
    due_date: ''
  });

  useEffect(() => {
    if (user.role !== 'Farm Manager' && user.role !== 'Admin') {
      navigate('/tasks');
    }
  }, [user.role, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const selectedWorker = users.find(u => u.name === form.assigned_to);
      if (!selectedWorker) {
        alert('Please select a valid worker');
        setSubmitting(false);
        return;
      }

      const taskData = {
        ...form,
        assigned_to: selectedWorker.id,
        assigned_by: user.user_id
      };

      const result = await addTask(taskData);
      
      if (result.success) {
        setShowModal(false);
        setForm({
          title: '',
          description: '',
          priority: 'medium',
          category: 'general',
          assigned_to: '',
          due_date: ''
        });
        navigate('/tasks');
      } else {
        alert('Failed to create task: ' + result.error);
      }
    } catch (error) {
      alert('Error creating task: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const workerUsers = users.filter(u => u.role === 'Worker' && u.status === 'active');

  if (user.role !== 'Farm Manager' && user.role !== 'Admin') {
    return <div>Access denied. Only Farm Managers and Admins can add tasks.</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Add New Task</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Task Title *
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Priority
            </label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Assign To
            </label>
            <select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            >
              <option value="">Select Worker</option>
              {workerUsers.map(worker => (
                <option key={worker.id} value={worker.name}>
                  {worker.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Due Date
            </label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            style={{
              padding: '10px 20px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f8f9fa',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              backgroundColor: '#28a745',
              color: 'white',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1
            }}
          >
            {submitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask; 