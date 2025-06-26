import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Auth.module.css';
import logo from '../../assets/logo.png';

const roles = [
  'Farm Manager',
  'Veterinarian',
  'Worker',
  'Admin'
];

const Signup = () => {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roles[0] });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signup(form);
    setLoading(false);
    if (result.success) {
      // Redirect handled by ProtectedRoute/App
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  return (
    <div className={styles['auth-container']}>
      <h1 className={styles['welcome-heading']}>Welcome to CowCo</h1>
      <div className={styles['auth-card']}>
        <div className={styles['auth-header']}>
          <div className={styles['auth-logo']}>
            <img src={logo} alt="CowCo Logo" />
          </div>
          <h2 className={styles['auth-title']}>Sign Up</h2>
          <p className={styles['auth-subtitle']}>Join our cattle management platform</p>
        </div>
        <form className={styles['auth-form']} onSubmit={handleSubmit}>
          {error && <div className={styles['auth-error']}>{error}</div>}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles['auth-submit']} disabled={loading}>
            {loading ? (
              <>
                <span className={styles['auth-loading']}></span>
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
          <div className={styles['auth-links']}>
            <a className={styles['auth-link']} onClick={() => navigate('/login')} tabIndex={0} role="button">
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
