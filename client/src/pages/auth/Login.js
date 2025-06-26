import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/Auth.module.css';
import logo from '../../assets/logo.png.png';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      // Redirect handled by ProtectedRoute/App
    } else {
      setError(result.error || 'Login failed');
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
          <h2 className={styles['auth-title']}>Login</h2>
          <p className={styles['auth-subtitle']}>Access your cattle management dashboard</p>
        </div>
        <form className={styles['auth-form']} onSubmit={handleSubmit}>
          {error && <div className={styles['auth-error']}>{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles['auth-submit']} disabled={loading}>
            {loading ? (
              <>
                <span className={styles['auth-loading']}></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
          <div className={styles['auth-links']}>
            <a className={styles['auth-link']} onClick={() => navigate('/signup')} tabIndex={0} role="button">
              Don't have an account? Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
