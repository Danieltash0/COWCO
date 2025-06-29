import React from 'react';
import { useReports } from '../../api/useReports';
import Loader from '../../components/Loader';

const Reports = () => {
  const { productionSummary, healthSummary, financialSummary, loading, error } = useReports();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Reports</h2>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Farm Reports</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
        
        {/* Production Summary */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: '15px' }}>Production Summary</h2>
          {productionSummary && (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Total Cattle:</strong> {productionSummary.totalCattle}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Total Milk (30 days):</strong> {productionSummary.totalMilk.toFixed(2)} L
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Average per Cow:</strong> {productionSummary.averagePerCow.toFixed(2)} L
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Milking Sessions:</strong> {productionSummary.milkingSessions}
              </div>
              <div>
                <strong>Top Producer:</strong> {productionSummary.topProducer}
              </div>
            </div>
          )}
        </div>

        {/* Health Summary */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Health Summary</h2>
          {healthSummary && (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Health Checkups (30 days):</strong> {healthSummary.totalCheckups}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Vaccinations (30 days):</strong> {healthSummary.vaccinations}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Treatments (30 days):</strong> {healthSummary.treatments}
              </div>
              <div>
                <strong>Healthy Cattle:</strong> {healthSummary.healthyCattle}
              </div>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>Financial Summary</h2>
          {financialSummary && (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Revenue (30 days):</strong> ${financialSummary.revenue.toFixed(2)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Expenses (30 days):</strong> ${financialSummary.expenses.toFixed(2)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Profit:</strong> 
                <span style={{ color: financialSummary.profit >= 0 ? '#28a745' : '#dc3545' }}>
                  {' '}${financialSummary.profit.toFixed(2)}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Profit Margin:</strong> {financialSummary.profitMargin}%
              </div>
              <div>
                <strong>Top Expense Categories:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                  {financialSummary.topExpenseCategories.map((category, index) => (
                    <li key={index}>
                      {category.category}: ${category.total.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Reports; 