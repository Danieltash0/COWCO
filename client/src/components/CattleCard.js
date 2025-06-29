import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CattleCard = ({ cattle, horizontalBar, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  // Check if user has permission to edit/delete (admin or farm manager)
  const canEditDelete = user && (user.role === 'Admin' || user.role === 'Farm Manager');

  const getHealthStatus = (health) => {
    switch (health) {
      case 'Excellent':
        return { color: 'green', icon: '🟢' };
      case 'Good':
        return { color: 'blue', icon: '🔵' };
      case 'Fair':
        return { color: 'orange', icon: '🟡' };
      case 'Poor':
        return { color: 'red', icon: '🔴' };
      default:
        return { color: 'gray', icon: '⚪' };
    }
  };

  const healthStatus = getHealthStatus(cattle.health);

  const handleEdit = (e) => {
    e.preventDefault();
    if (onEdit) {
      onEdit(cattle);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    if (onDelete) {
      onDelete(cattle);
    }
  };

  return (
    <div className={`dashboard-card${horizontalBar ? ' horizontal-bar' : ''}`}>
      <div className="card-header">
        <h3 className="card-title">{cattle.name}</h3>
        <span className={`status ${healthStatus.color}`}>
          {healthStatus.icon} {cattle.health}
        </span>
      </div>
      <div className="cattle-info">
        <div className="info-row">
          <span className="label">ID tag:</span>
          <span className="value">{cattle.tag_number || cattle.cattle_id || cattle.id}</span>
        </div>
        <div className="info-row">
          <span className="label">Name:</span>
          <span className="value">{cattle.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Breed:</span>
          <span className="value">{cattle.breed}</span>
        </div>
      </div>
      <div className="form-actions">
        <Link to={`/cattle/${cattle.cattle_id || cattle.id}`} className="btn btn-primary">
          View Profile
        </Link>
        <Link to={`/cattle/${cattle.cattle_id || cattle.id}/qr`} className="btn btn-secondary">
          QR Code
        </Link>
        {canEditDelete && (
          <>
            <Link to={`/cattle/${cattle.cattle_id || cattle.id}/edit`} className="btn btn-warning">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CattleCard;
