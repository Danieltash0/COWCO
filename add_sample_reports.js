const pool = require('./server/utils/database');

async function addSampleReports() {
  try {
    console.log('Adding sample reports to database...');
    
    // Sample reports data
    const sampleReports = [
      {
        title: 'Monthly Production Report - January 2024',
        type: 'production',
        generated_by: 1,
        data: JSON.stringify({
          totalMilk: 2500,
          averagePerCow: 833,
          topProducer: 'Bessie',
          totalCattle: 3
        }),
        created_at: '2024-01-31 10:00:00'
      },
      {
        title: 'Health Status Report - Q1 2024',
        type: 'health',
        generated_by: 1,
        data: JSON.stringify({
          totalCheckups: 5,
          vaccinations: 3,
          treatments: 2,
          healthyCattle: 2
        }),
        created_at: '2024-01-15 14:30:00'
      },
      {
        title: 'Financial Summary - January 2024',
        type: 'financial',
        generated_by: 1,
        data: JSON.stringify({
          revenue: 5000,
          expenses: 2800,
          profit: 2200,
          profitMargin: 44
        }),
        created_at: '2024-01-31 16:00:00'
      },
      {
        title: 'General Farm Report - January 2024',
        type: 'general',
        generated_by: 1,
        data: JSON.stringify({
          totalTasks: 6,
          completedTasks: 1,
          pendingTasks: 5,
          completionRate: 17
        }),
        created_at: '2024-01-31 18:00:00'
      }
    ];

    // Check if reports already exist
    const [existingReports] = await pool.execute('SELECT COUNT(*) as count FROM reports');
    
    if (existingReports[0].count > 0) {
      console.log('Reports already exist in database. Skipping...');
      return;
    }

    // Insert sample reports
    for (const report of sampleReports) {
      await pool.execute(
        'INSERT INTO reports (title, type, generated_by, data, created_at) VALUES (?, ?, ?, ?, ?)',
        [report.title, report.type, report.generated_by, report.data, report.created_at]
      );
      console.log(`Added report: ${report.title}`);
    }

    console.log('Sample reports added successfully!');
    
    // Verify the reports were added
    const [reports] = await pool.execute('SELECT * FROM reports');
    console.log(`Total reports in database: ${reports.length}`);
    
  } catch (error) {
    console.error('Error adding sample reports:', error);
  } finally {
    await pool.end();
  }
}

addSampleReports(); 