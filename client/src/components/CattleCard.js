import React from 'react';
import { Link } from 'react-router-dom';

const CattleCard = ({ cattle, horizontalBar }) => {
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
      </div>
    </div>
  );
};

export default CattleCard;
