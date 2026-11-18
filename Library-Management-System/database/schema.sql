CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  membership_id VARCHAR(40) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin','Librarian','Member') NOT NULL DEFAULT 'Member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  author VARCHAR(120) NOT NULL,
  genre VARCHAR(80) NOT NULL,
  isbn VARCHAR(30) NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NULL,
  type ENUM('STOCK_IN','BORROW') NOT NULL,
  quantity INT NOT NULL,
  note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_transaction_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
  CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

INSERT IGNORE INTO users (name, membership_id, password, role)
VALUES ('System Administrator', 'ADMIN001', 'admin123', 'Admin');

INSERT IGNORE INTO books (title, author, genre, isbn, quantity) VALUES
('Things Fall Apart', 'Chinua Achebe', 'Fiction', '9780385474542', 5),
('The River Between', 'Ngugi wa Thiong''o', 'Literature', '9780435905484', 1),
('Introduction to Computing', 'Peter Norton', 'Technology', '9780078822253', 3);
