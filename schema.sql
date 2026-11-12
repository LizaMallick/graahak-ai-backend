CREATE DATABASE IF NOT EXISTS graahak_db;
USE graahak_db;

CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    issue_category VARCHAR(100) DEFAULT 'GENERAL',
    merchant_name VARCHAR(150),
    claimed_amount DECIMAL(10, 2) DEFAULT 0.00,
    user_narrative TEXT NOT NULL,
    ai_summary TEXT,
    legal_rights TEXT,
    recommended_action TEXT,
    status ENUM('PENDING', 'ANALYZED', 'RESOLVED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS evidence_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_id INT NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    mimetype VARCHAR(100),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);