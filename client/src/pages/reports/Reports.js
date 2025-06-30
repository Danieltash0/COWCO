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
                <strong>Total Cows:</strong> {productionSummary.totalCattle}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Total Milk (30 days):</strong> {Number(productionSummary.totalMilk).toFixed(2)} L
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Average per Session:</strong> {Number(productionSummary.averagePerSession).toFixed(2)} L
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Milking Sessions:</strong> {productionSummary.milkingSessions}
              </div>
              <div>
                <strong>Top Producer (Cow):</strong> {productionSummary.topProducer}
              </div>
            </div>
          )}
        </div>

        {/* Scheduled Appointments (replaces Health Summary) */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Scheduled Appointments</h2>
          <div>
            <p>View and manage upcoming health appointments for cattle. (See Vet Dashboard for full details.)</p>
          </div>
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
                <strong>Revenue (30 days):</strong> KSHS {Number(financialSummary.revenue).toFixed(2)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Expenses (30 days):</strong> KSHS {Number(financialSummary.expenses).toFixed(2)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Profit:</strong> 
                <span style={{ color: Number(financialSummary.profit) >= 0 ? '#28a745' : '#dc3545' }}>
                  {' '}KSHS {Number(financialSummary.profit).toFixed(2)}
                </span>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Profit Margin:</strong> {Number(financialSummary.profitMargin).toFixed(1)}%
              </div>
              <div>
                <strong>Top Expense Categories:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                  {financialSummary.topExpenseCategories && financialSummary.topExpenseCategories.map((category, index) => (
                    <li key={index}>
                      {category.category}: KSHS {Number(category.total).toFixed(2)}
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