import React from 'react';
import { useReports } from '../../api/useReports';
import Loader from '../../components/Loader';
import jsPDF from 'jspdf';

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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(18);
    doc.text('Farm Reports Summary', 10, y);
    y += 10;
    doc.setFontSize(14);
    doc.text('Production Summary', 10, y);
    y += 8;
    if (productionSummary) {
      doc.setFontSize(11);
      doc.text(`Total Cows: ${productionSummary.totalCattle ?? ''}`, 12, y += 7);
      doc.text(`Total Milk (30 days): ${Number(productionSummary.totalMilk).toFixed(2)} L`, 12, y += 7);
      doc.text(`Average per Session: ${Number(productionSummary.averagePerSession).toFixed(2)} L`, 12, y += 7);
      doc.text(`Milking Sessions: ${productionSummary.milkingSessions ?? ''}`, 12, y += 7);
      doc.text(`Top Producer (Cow): ${productionSummary.topProducer ?? ''}`, 12, y += 7);
    }
    y += 5;
    doc.setFontSize(14);
    doc.text('Medical Summary', 10, y += 10);
    if (healthSummary) {
      doc.setFontSize(11);
      if (healthSummary.healthStatusCounts) {
        doc.text('Cattle by Health Status:', 12, y += 7);
        healthSummary.healthStatusCounts.forEach((row) => {
          doc.text(`- ${row.health}: ${row.count}`, 16, y += 6);
        });
      }
      doc.text(`Number of Appointments: ${healthSummary.totalAppointments ?? ''}`, 12, y += 7);
      doc.text(`Number of Veterinarians: ${healthSummary.vetCount ?? ''}`, 12, y += 7);
    }
    y += 5;
    doc.setFontSize(14);
    doc.text('Financial Summary', 10, y += 10);
    if (financialSummary) {
      doc.setFontSize(11);
      doc.text(`Revenue (30 days): KSHS ${Number(financialSummary.revenue).toFixed(2)}`, 12, y += 7);
      doc.text(`Expenses (30 days): KSHS ${Number(financialSummary.expenses).toFixed(2)}`, 12, y += 7);
      doc.text(`Profit: KSHS ${Number(financialSummary.profit).toFixed(2)}`, 12, y += 7);
      doc.text(`Profit Margin: ${Number(financialSummary.profitMargin).toFixed(1)}%`, 12, y += 7);
      if (financialSummary.topExpenseCategories) {
        doc.text('Top Expense Categories:', 12, y += 7);
        financialSummary.topExpenseCategories.forEach((cat) => {
          doc.text(`- ${cat.category}: KSHS ${Number(cat.total).toFixed(2)}`, 16, y += 6);
        });
      }
    }
    doc.save('Farm_Reports_Summary.pdf');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Farm Reports</h1>
      <button onClick={handleExportPDF} style={{ marginBottom: '20px', padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Export Summary Report (PDF)
      </button>
      
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

        {/* Medical Summary (was Scheduled Appointments) */}
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '20px',
          border: '1px solid #e9ecef'
        }}>
          <h2 style={{ color: '#007bff', marginBottom: '15px' }}>Medical Summary</h2>
          {healthSummary && (
            <div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Cattle by Health Status:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                  {healthSummary.healthStatusCounts && healthSummary.healthStatusCounts.map((row, idx) => (
                    <li key={idx}>{row.health}: {row.count}</li>
                  ))}
                </ul>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Number of Appointments:</strong> {healthSummary.totalAppointments}
              </div>
              <div>
                <strong>Number of Veterinarians:</strong> {healthSummary.vetCount}
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