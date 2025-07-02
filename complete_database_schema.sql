-- Complete Database Schema for CowCo Cattle Management System

-- Users Table (Updated with status and last_login tracking)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('manager', 'vet', 'worker', 'admin') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_status (status),
    INDEX idx_users_role (role),
    INDEX idx_users_last_login (last_login)
);

-- Cattle Table (Updated with frontend form fields)
CREATE TABLE cattle (
    cattle_id INT AUTO_INCREMENT PRIMARY KEY,
    tag_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    breed VARCHAR(100),
    health ENUM('Excellent', 'Good', 'Fair', 'Poor') DEFAULT 'Good',
    gender ENUM('Female', 'Male') DEFAULT 'Female',
    date_of_birth DATE NULL,
    notes TEXT NULL,
    added_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (added_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_cattle_health (health),
    INDEX idx_cattle_gender (gender),
    INDEX idx_cattle_date_of_birth (date_of_birth)
);

-- Milking Records Table
CREATE TABLE milking_records (
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
);

-- Health Records Table
CREATE TABLE health_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    cattle_id INT,
    vet_id INT,
    treatment TEXT,
    medical_procedure TEXT,
    diagnosis TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (cattle_id) REFERENCES cattle(cattle_id) ON DELETE CASCADE,
    FOREIGN KEY (vet_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Financial Records Table (New table for analytics)
CREATE TABLE financial_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'cash',
    reference_number VARCHAR(100) NULL,
    status ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
    description TEXT NOT NULL,
    date DATE NOT NULL,
    notes TEXT NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_financial_payment_method (payment_method),
    INDEX idx_financial_status (status),
    INDEX idx_financial_date (date),
    INDEX idx_financial_type (type),
    INDEX idx_financial_category (category)
);

-- Tasks Table (Updated with frontend form fields)
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    category ENUM('general', 'feeding', 'cleaning', 'health', 'maintenance', 'milking', 'breeding', 'transport') DEFAULT 'general',
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    completed_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_to INT,
    assigned_by INT,
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_tasks_title (title),
    INDEX idx_tasks_priority (priority),
    INDEX idx_tasks_category (category),
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_due_date (due_date),
    INDEX idx_tasks_assigned_to (assigned_to),
    INDEX idx_tasks_assigned_by (assigned_by)
);

-- QR Codes Table
CREATE TABLE qr_codes (
    qr_id INT AUTO_INCREMENT PRIMARY KEY,
    cattle_id INT,
    qr_data TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cattle_id) REFERENCES cattle(cattle_id) ON DELETE CASCADE
);

-- Reports Table
CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type ENUM('production', 'health', 'financial', 'general') NOT NULL,
    generated_by INT,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Activity Logs Table (Enhanced for better tracking)
CREATE TABLE activity_logs (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_activity_logs_user_id (user_id),
    INDEX idx_activity_logs_action (action),
    INDEX idx_activity_logs_timestamp (timestamp)
);

-- Health Appointments Table
CREATE TABLE IF NOT EXISTS health_appointments (
    appointment_id INT AUTO_INCREMENT PRIMARY KEY,
    cattle_id INT,
    vet_id INT,
    appointment_date DATE NOT NULL,
    reason VARCHAR(255),
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cattle_id) REFERENCES cattle(cattle_id) ON DELETE CASCADE,
    FOREIGN KEY (vet_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Insert default admin user
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin User', 'admin@cowco.com', 'admin123', 'admin');

-- Insert sample cattle data
INSERT INTO cattle (tag_number, name, breed, health, gender, date_of_birth, notes, added_by) VALUES 
('CT001', 'Bessie', 'Holstein', 'Good', 'Female', '2020-03-15', 'Friendly cow, good milk producer', 1),
('CT002', 'Daisy', 'Jersey', 'Excellent', 'Female', '2019-07-22', 'High butterfat content', 1),
('CT003', 'Molly', 'Angus', 'Fair', 'Female', '2021-01-10', 'Young heifer, growing well', 1);

-- Insert sample financial records
INSERT INTO financial_records (type, category, amount, payment_method, description, date, created_by) VALUES 
('income', 'Milk Sales', 5000.00, 'bank_transfer', 'Monthly milk sales', '2024-01-15', 1),
('expense', 'Feed & Nutrition', 2000.00, 'cash', 'Feed purchase for January', '2024-01-10', 1),
('expense', 'Veterinary Care', 800.00, 'credit_card', 'Routine health checkup', '2024-01-12', 1);

-- Insert sample tasks with new structure
INSERT INTO tasks (title, description, assigned_to, assigned_by, priority, category, status, due_date, is_completed) VALUES 
('Feed cattle in Barn A', 'Ensure all cattle in Barn A receive their daily feed ration', 1, 1, 'high', 'feeding', 'pending', '2024-01-20', FALSE),
('Check water troughs', 'Inspect and clean water troughs in all barns', 1, 1, 'medium', 'cleaning', 'pending', '2024-01-19', FALSE),
('Clean milking equipment', 'Thoroughly clean and sanitize all milking equipment', 1, 1, 'high', 'cleaning', 'completed', '2024-01-18', TRUE),
('Medical procedure for cattle', 'Administer annual medical procedures to all cattle', 1, 1, 'high', 'health', 'pending', '2024-01-25', FALSE),
('Repair fence', 'Fix broken sections of the perimeter fence', 1, 1, 'medium', 'maintenance', 'pending', '2024-01-22', FALSE),
('Transport cattle', 'Move cattle from Barn A to pasture', 1, 1, 'low', 'transport', 'pending', '2024-01-23', FALSE);

-- Insert sample health records
INSERT INTO health_records (cattle_id, vet_id, treatment, medical_procedure, diagnosis, record_date) VALUES 
(1, 1, 'Routine checkup completed', 'Annual medical procedure', 'Healthy', '2024-01-15'),
(2, 1, 'Hoof trimming', 'None', 'Minor hoof issue resolved', '2024-01-10');

-- Insert sample QR codes
INSERT INTO qr_codes (cattle_id, qr_data) VALUES 
(1, '{"cattle_id": 1, "tag_number": "CT001", "name": "Bessie"}'),
(2, '{"cattle_id": 2, "tag_number": "CT002", "name": "Daisy"}'),
(3, '{"cattle_id": 3, "tag_number": "CT003", "name": "Molly"}');

-- Insert sample activity logs
INSERT INTO activity_logs (user_id, action) VALUES 
(1, 'Created new cattle record: Bessie'),
(1, 'Added financial record: Milk sales'),
(1, 'Completed task: Clean milking equipment');

-- Insert sample reports
INSERT INTO reports (title, type, generated_by, data, created_at) VALUES 
('Monthly Production Report - January 2024', 'production', 1, '{"totalMilk": 2500, "averagePerCow": 833, "topProducer": "Bessie", "totalCattle": 3}', '2024-01-31 10:00:00'),
('Health Status Report - Q1 2024', 'health', 1, '{"totalCheckups": 5, "medical_procedures": 3, "treatments": 2, "healthyCattle": 2}', '2024-01-15 14:30:00'),
('Financial Summary - January 2024', 'financial', 1, '{"revenue": 5000, "expenses": 2800, "profit": 2200, "profitMargin": 44}', '2024-01-31 16:00:00'),
('General Farm Report - January 2024', 'general', 1, '{"totalTasks": 6, "completedTasks": 1, "pendingTasks": 5, "completionRate": 17}', '2024-01-31 18:00:00');

-- Verify the database structure
SHOW TABLES; 