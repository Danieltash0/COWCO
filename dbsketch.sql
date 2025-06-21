--Simplified and Normalized Database Schema

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role ENUM('manager', 'vet', 'worker', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cattle Table
CREATE TABLE cattle (
    cattle_id SERIAL PRIMARY KEY,
    tag_number VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    breed VARCHAR(100),
    age INTEGER,
    added_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Records Table
CREATE TABLE health_records (
    record_id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(cattle_id) ON DELETE CASCADE,
    vet_id INTEGER REFERENCES users(user_id),
    treatment TEXT,
    vaccination TEXT,
    diagnosis TEXT,
    record_date DATE DEFAULT CURRENT_DATE
);

-- Breeding & Milking & Feeding & Finance can be abstracted as events for simplicity
CREATE TABLE cattle_events (
    event_id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(cattle_id) ON DELETE CASCADE,
    event_type ENUM('breeding', 'milking', 'feeding', 'financial'),
    description TEXT,
    amount NUMERIC(10, 2),
    event_date DATE DEFAULT CURRENT_DATE
);

-- Tasks Table
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    assigned_to INTEGER REFERENCES users(user_id),
    assigned_by INTEGER REFERENCES users(user_id),
    task_description TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    due_date DATE
);

-- QR Codes (optional, for storing the image or text mapping)
CREATE TABLE qr_codes (
    qr_id SERIAL PRIMARY KEY,
    cattle_id INTEGER REFERENCES cattle(cattle_id) ON DELETE CASCADE,
    qr_data TEXT NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs Table
CREATE TABLE activity_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
