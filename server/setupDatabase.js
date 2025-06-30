const mysql = require('mysql2/promise');

async function setupDatabase() {
  let connection;
  
  try {
    // Connect to MySQL without specifying a database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });

    console.log('Connected to MySQL server');

    // Create database if it doesn't exist
    await connection.execute('CREATE DATABASE IF NOT EXISTS cowco_db');
    console.log('Database cowco_db created or already exists');

    await connection.end();

    // Now connect to the cowco_db database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'cowco_db'
    });

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role ENUM('manager', 'vet', 'worker', 'admin') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS cattle (
        cattle_id INT AUTO_INCREMENT PRIMARY KEY,
        tag_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100),
        breed VARCHAR(100),
        added_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (added_by) REFERENCES users(user_id) ON DELETE SET NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS health_records (
        record_id INT AUTO_INCREMENT PRIMARY KEY,
        cattle_id INT,
        vet_id INT,
        treatment TEXT,
        medical_procedure TEXT,
        diagnosis TEXT,
        record_date DATE DEFAULT CURRENT_DATE,
        FOREIGN KEY (cattle_id) REFERENCES cattle(cattle_id) ON DELETE CASCADE,
        FOREIGN KEY (vet_id) REFERENCES users(user_id) ON DELETE SET NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS tasks (
        task_id INT AUTO_INCREMENT PRIMARY KEY,
        assigned_to INT,
        assigned_by INT,
        task_description TEXT NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS qr_codes (
        qr_id INT AUTO_INCREMENT PRIMARY KEY,
        cattle_id INT,
        qr_data TEXT NOT NULL,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cattle_id) REFERENCES cattle(cattle_id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS reports (
        report_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        type ENUM('production', 'health', 'financial', 'general') NOT NULL,
        generated_by INT,
        data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (generated_by) REFERENCES users(user_id) ON DELETE SET NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS activity_logs (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS financial_records (
        record_id INT AUTO_INCREMENT PRIMARY KEY,
        type ENUM('income', 'expense') NOT NULL,
        category VARCHAR(100) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        payment_method VARCHAR(50),
        reference_number VARCHAR(100),
        notes TEXT,
        status ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
      )`,
      
      `CREATE TABLE IF NOT EXISTS milking_records (
        record_id INT AUTO_INCREMENT PRIMARY KEY,
        cattle_id INT NOT NULL,
        amount DECIMAL(8,2) NOT NULL,
        session_type ENUM('morning', 'afternoon', 'evening') NOT NULL DEFAULT 'morning',
        milking_date DATE NOT NULL DEFAULT CURRENT_DATE,
        notes TEXT,
        recorded_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cattle_id) REFERENCES cattle(cattle_id) ON DELETE CASCADE,
        FOREIGN KEY (recorded_by) REFERENCES users(user_id) ON DELETE SET NULL
      )`
    ];

    for (const table of tables) {
      await connection.execute(table);
    }

    console.log('All tables created successfully');

    // Insert a test user if none exists
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (users[0].count === 0) {
      await connection.execute(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@cowco.com', 'admin123', 'admin']
      );
      console.log('Test admin user created: admin@cowco.com / admin123');
    }

    // Insert some test cattle if none exists
    const [cattle] = await connection.execute('SELECT COUNT(*) as count FROM cattle');
    if (cattle[0].count === 0) {
      await connection.execute(
        'INSERT INTO cattle (tag_number, name, breed, added_by) VALUES (?, ?, ?, ?)',
        ['COW001', 'Bessie', 'Holstein', 1]
      );
      await connection.execute(
        'INSERT INTO cattle (tag_number, name, breed, added_by) VALUES (?, ?, ?, ?)',
        ['COW002', 'Daisy', 'Jersey', 1]
      );
      console.log('Test cattle data inserted');
    }

    // Insert some test financial records if none exists
    const [financialRecords] = await connection.execute('SELECT COUNT(*) as count FROM financial_records');
    if (financialRecords[0].count === 0) {
      await connection.execute(
        'INSERT INTO financial_records (type, category, amount, description, date, payment_method, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['income', 'Milk Sales', 5000.00, 'Monthly milk sales', '2024-01-15', 'bank_transfer', 1]
      );
      await connection.execute(
        'INSERT INTO financial_records (type, category, amount, description, date, payment_method, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['expense', 'Feed & Nutrition', 2000.00, 'Feed purchase for January', '2024-01-10', 'cash', 1]
      );
      await connection.execute(
        'INSERT INTO financial_records (type, category, amount, description, date, payment_method, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        ['expense', 'Veterinary Care', 800.00, 'Routine health checkup', '2024-01-12', 'credit_card', 1]
      );
      console.log('Test financial records inserted');
    }

    console.log('Database setup completed successfully!');

  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase(); 