const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',            // or your MySQL username
  password: 'A132b59m!@#$PaUl', // your MySQL password
  database: 'project_216',    // replace with your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
