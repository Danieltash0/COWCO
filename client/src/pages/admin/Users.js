import React, { useState } from 'react';
import { useAdmin } from '../../api/useAdmin';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';
import '../../styles/Admin.module.css';

const Users = () => {
  const { users, loading, error, addUser, updateUser, deleteUser, toggleUserStatus } = useAdmin();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'Worker',
    password: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    const result = editingUser 
      ? await updateUser(editingUser.id, form)
      : await addUser(form);
    
    setSubmitting(false);
    
    if (result.success) {
      setShowModal(false);
      setEditingUser(null);
      setForm({
        name: '',
        email: '',
        role: 'Worker',
        password: ''
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
    }
  };

  const handleToggleStatus = async (userId) => {
    await toggleUserStatus(userId);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'red';
      case 'Farm Manager': return 'blue';
      case 'Veterinarian': return 'green';
      case 'Worker': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red';
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="users-container">
      <div className="page-header">
        <h2>User Management</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          Add New User
        </button>
      </div>

      <div className="users-summary">
        <div className="summary-card">
          <h3>Total Users</h3>
          <div className="summary-count">{users.length}</div>
        </div>
        <div className="summary-card">
          <h3>Active Users</h3>
          <div className="summary-count green">
            {users.filter(u => u.status === 'active').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Inactive Users</h3>
          <div className="summary-count red">
            {users.filter(u => u.status === 'inactive').length}
          </div>
        </div>
        <div className="summary-card">
          <h3>Admins</h3>
          <div className="summary-count">
            {users.filter(u => u.role === 'Admin').length}
          </div>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td>
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Never'
                  }
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="btn btn-small btn-secondary"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`btn btn-small ${user.status === 'active' ? 'btn-warning' : 'btn-success'}`}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="btn btn-small btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          setForm({
            name: '',
            email: '',
            role: 'Worker',
            password: ''
          });
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
        size="large"
      >
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="Worker">Worker</option>
              <option value="Veterinarian">Veterinarian</option>
              <option value="Farm Manager">Farm Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {!editingUser && (
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {editingUser && (
            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
                setForm({
                  name: '',
                  email: '',
                  role: 'Worker',
                  password: ''
                });
              }} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Users;
