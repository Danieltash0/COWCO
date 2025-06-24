import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Admin.module.css';

const UserCard = ({ user, onEdit, onDelete, onStatusChange }) => {
  const {
    id,
    name,
    email,
    role,
    status,
    avatar,
    lastLogin,
    createdAt,
    department
  } = user;

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return styles.admin;
      case 'manager':
        return styles.manager;
      case 'vet':
        return styles.vet;
      case 'worker':
        return styles.worker;
      default:
        return styles.worker;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return styles.active;
      case 'inactive':
        return styles.inactive;
      case 'pending':
        return styles.pending;
      default:
        return styles.pending;
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(user);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (onStatusChange) {
      onStatusChange(id, newStatus);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.userCard}>
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <div className={styles.userAvatarPlaceholder}>
              {getInitials(name)}
            </div>
          )}
        </div>
        
        <div className={styles.userDetails}>
          <h4 className={styles.userName}>{name}</h4>
          <p className={styles.userEmail}>{email}</p>
          {department && (
            <p className={styles.userDepartment}>{department}</p>
          )}
        </div>
      </div>

      <div className={styles.userMeta}>
        <div className={styles.userMetaItem}>
          <span className={styles.userMetaLabel}>Role:</span>
          <span className={`${styles.roleBadge} ${getRoleColor(role)}`}>
            {role}
          </span>
        </div>
        
        <div className={styles.userMetaItem}>
          <span className={styles.userMetaLabel}>Status:</span>
          <span className={`${styles.statusBadge} ${getStatusColor(status)}`}>
            {status}
          </span>
        </div>
        
        <div className={styles.userMetaItem}>
          <span className={styles.userMetaLabel}>Last Login:</span>
          <span className={styles.userMetaValue}>
            {lastLogin ? formatDate(lastLogin) : 'Never'}
          </span>
        </div>
        
        <div className={styles.userMetaItem}>
          <span className={styles.userMetaLabel}>Joined:</span>
          <span className={styles.userMetaValue}>
            {formatDate(createdAt)}
          </span>
        </div>
      </div>

      <div className={styles.userActions}>
        <button
          className="btn btn-primary"
          onClick={handleEdit}
        >
          Edit
        </button>

        {status === 'active' ? (
          <button
            className="btn btn-warning"
            onClick={() => handleStatusChange('inactive')}
          >
            Deactivate
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={() => handleStatusChange('active')}
          >
            Activate
          </button>
        )}

        <button
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>

        <Link
          to={`/users/${id}`}
          className="btn btn-secondary"
        >
          View Profile
        </Link>
      </div>

      <div className={styles.userQuickActions}>
        <Link
          to={`/users/${id}/logs`}
          className="btn btn-outline btn-sm"
        >
          View Logs
        </Link>
        
        <Link
          to={`/users/${id}/permissions`}
          className="btn btn-outline btn-sm"
        >
          Permissions
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
