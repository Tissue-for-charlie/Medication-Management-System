CREATE DATABASE IF NOT EXISTS pharma_sys DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE pharma_sys;
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL,
    name VARCHAR(64) NOT NULL,
    phone VARCHAR(32) NOT NULL,
    role VARCHAR(16) NOT NULL,
    status VARCHAR(8) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL,
    UNIQUE KEY uk_users_username (username)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(64) NOT NULL,
    code VARCHAR(32) NOT NULL,
    description VARCHAR(255) NOT NULL DEFAULT '',
    sort INT NOT NULL DEFAULT 1,
    status VARCHAR(8) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_categories_code (code),
    UNIQUE KEY uk_categories_name (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE IF NOT EXISTS medicines (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(32) NOT NULL,
    name VARCHAR(128) NOT NULL,
    category_id INT NOT NULL,
    spec VARCHAR(128) NOT NULL DEFAULT '',
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    expire_date DATE NOT NULL,
    maker VARCHAR(128) NOT NULL DEFAULT '',
    status VARCHAR(8) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_medicines_code (code),
    KEY idx_medicines_category (category_id),
    CONSTRAINT fk_medicines_category FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE IF NOT EXISTS suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128) NOT NULL,
    contact VARCHAR(64) NOT NULL DEFAULT '',
    phone VARCHAR(32) NOT NULL DEFAULT '',
    address VARCHAR(255) NOT NULL DEFAULT '',
    rating VARCHAR(8) NOT NULL,
    status VARCHAR(8) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_suppliers_name (name)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE IF NOT EXISTS procurement_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(64) NOT NULL,
    medicine_id INT NOT NULL,
    supplier_id INT NOT NULL,
    qty INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    order_date DATE NOT NULL,
    operator VARCHAR(64) NOT NULL DEFAULT '',
    status VARCHAR(8) NOT NULL,
    note VARCHAR(255) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_procurement_code (code),
    KEY idx_procurement_medicine (medicine_id),
    KEY idx_procurement_supplier (supplier_id),
    KEY idx_procurement_order_date (order_date),
    CONSTRAINT fk_procurement_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON UPDATE RESTRICT ON DELETE RESTRICT,
    CONSTRAINT fk_procurement_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE IF NOT EXISTS sales_orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(64) NOT NULL,
    medicine_id INT NOT NULL,
    qty INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    customer VARCHAR(128) NOT NULL,
    sale_date DATE NOT NULL,
    seller VARCHAR(64) NOT NULL DEFAULT '',
    status VARCHAR(8) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_sales_code (code),
    KEY idx_sales_medicine (medicine_id),
    KEY idx_sales_sale_date (sale_date),
    CONSTRAINT fk_sales_medicine FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON UPDATE RESTRICT ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE IF NOT EXISTS audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    username VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    resource VARCHAR(64) NOT NULL,
    resource_id INT,
    detail VARCHAR(500) NOT NULL DEFAULT '',
    ip VARCHAR(45) NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_audit_user (user_id),
    KEY idx_audit_action (action),
    KEY idx_audit_resource (resource),
    KEY idx_audit_created (created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;