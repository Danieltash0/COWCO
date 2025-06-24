import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCattle } from '../../api/useCattle';
import CattleCard from '../../components/CattleCard';
import Loader from '../../components/Loader';

const CattleList = () => {
  const { cattle, loading, error } = useCattle();
  const [searchTerm, setSearchTerm] = useState('');
  const [healthFilter, setHealthFilter] = useState('all');

  const filteredCattle = cattle.filter(cow => {
    const matchesSearch = cow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cow.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cow.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHealth = healthFilter === 'all' || cow.health === healthFilter;
    return matchesSearch && matchesHealth;
  });

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
              placeholder="Search by name, ID, or breed..."
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
            <CattleCard key={cow.id} cattle={cow} horizontalBar />
          ))
        )}
      </div>
    </div>
  );
};

export default CattleList;
