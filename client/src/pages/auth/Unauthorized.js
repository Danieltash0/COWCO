import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Unauthorized</h2>
        <p>You do not have permission to access this page.</p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized; 