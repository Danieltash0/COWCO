import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import CattleCard from '../../components/CattleCard';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const CattleList = () => {
  const { cattle, loading, error, deleteCattle } = useCattle();
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cattleToDelete, setCattleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const filteredCattle = cattle.filter(cow => {
    const matchesSearch = cow.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cow.tag_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cow.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = healthFilter === 'all' || cow.health === healthFilter;
    return matchesSearch && matchesHealth;
  });

  const handleEdit = (cattle) => {
    navigate(`/cattle/${cattle.cattle_id || cattle.id}/edit`);
  };

  const handleDelete = (cattle) => {
    setCattleToDelete(cattle);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!cattleToDelete) return;
    
    setDeleteLoading(true);
    try {
      const cattleId = cattleToDelete.cattle_id || cattleToDelete.id;
      const result = await deleteCattle(cattleId);
      
      if (result.success) {
        setShowDeleteModal(false);
        setCattleToDelete(null);
      } else {
        alert('Failed to delete cattle: ' + result.error);
      }
    } catch (error) {
      alert('Error deleting cattle: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCattleToDelete(null);
  };

  if (loading) return <Loader />;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="content-title">Cattle Management</h1>
        <div className="content-actions">
          <Link to="/cattle/add" className="btn btn-primary">
            Add New Cattle
          </Link>
        </div>
      </div>

      <div className="content-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="search">Search Cattle</label>
            <input
              id="search"
              type="text"
              placeholder="Search by name, tag number, or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="health-filter">Health Status</label>
            <select 
              id="health-filter"
              value={healthFilter} 
              onChange={(e) => setHealthFilter(e.target.value)}
            >
              <option value="all">All Health Status</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-cards horizontal-bar">
        {filteredCattle.length === 0 ? (
          <div className="content-container">
            <div className="text-center">
              <p className="text-gray">No cattle found matching your criteria.</p>
              <Link to="/cattle/add" className="btn btn-primary mt-3">
                Add Your First Cattle
              </Link>
            </div>
          </div>
        ) : (
          filteredCattle.map(cow => (
            <CattleCard 
              key={cow.cattle_id || cow.id} 
              cattle={cow} 
              horizontalBar 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Confirm Delete"
        size="small"
      >
        <div className="modal-content">
          <p>Are you sure you want to delete <strong>{cattleToDelete?.name}</strong>?</p>
          <p className="text-gray">This action cannot be undone.</p>
          
          <div className="modal-actions">
            <button 
              onClick={cancelDelete} 
              className="btn btn-secondary"
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button 
              onClick={confirmDelete} 
              className="btn btn-danger"
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CattleList;
