CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash TEXT,
    role ENUM('manager', 'veterinarian', 'worker', 'admin') NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cattle (
    cattle_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_number VARCHAR(50) UNIQUE,
    breed VARCHAR(50),
    sex ENUM('male', 'female'),
    date_of_birth DATE,
    weight_kg DECIMAL(5,2),
    manager_id INT,
    qr_code TEXT, -- optional: base64 or file path
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES Users(user_id)
);

CREATE TABLE HealthRecords (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    cattle_id INT,
    date DATE,
    health_status VARCHAR(255),
    treatment VARCHAR(255),
    veterinarian_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cattle_id) REFERENCES Cattle(cattle_id),
    FOREIGN KEY (veterinarian_id) REFERENCES Users(user_id)
);

CREATE TABLE FeedingRecords (
    feeding_id INT PRIMARY KEY AUTO_INCREMENT,
    cattle_id INT,
    feed_type VARCHAR(100),
    quantity_kg DECIMAL(5,2),
    feeding_time DATETIME,
    worker_id INT,
    FOREIGN KEY (cattle_id) REFERENCES Cattle(cattle_id),
    FOREIGN KEY (worker_id) REFERENCES Users(user_id)
);

CREATE TABLE MilkingRecords (
    milk_id INT PRIMARY KEY AUTO_INCREMENT,
    cattle_id INT,
    amount_litres DECIMAL(5,2),
    milking_time DATETIME,
    worker_id INT,
    FOREIGN KEY (cattle_id) REFERENCES Cattle(cattle_id),
    FOREIGN KEY (worker_id) REFERENCES Users(user_id)
);

CREATE TABLE BreedingRecords (
    breeding_id INT PRIMARY KEY AUTO_INCREMENT,
    cattle_id INT,
    breeding_type ENUM('natural', 'artificial'),
    date_of_breeding DATE,
    outcome ENUM('pregnant', 'not_pregnant', 'unknown'),
    delivery_date DATE,
    calf_count INT,
    notes TEXT,
    FOREIGN KEY (cattle_id) REFERENCES Cattle(cattle_id)
);

CREATE TABLE FinancialRecords (
    finance_id INT PRIMARY KEY AUTO_INCREMENT,
    cattle_id INT,
    type ENUM('income', 'expense'),
    amount DECIMAL(10,2),
    description TEXT,
    date DATE,
    FOREIGN KEY (cattle_id) REFERENCES Cattle(cattle_id)
);

CREATE TABLE Tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100),
    description TEXT,
    assigned_to INT,
    assigned_by INT,
    related_cattle INT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES Users(user_id),
    FOREIGN KEY (assigned_by) REFERENCES Users(user_id),
    FOREIGN KEY (related_cattle) REFERENCES Cattle(cattle_id)
);

CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

