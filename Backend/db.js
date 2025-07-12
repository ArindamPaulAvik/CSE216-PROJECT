// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',        // Database host
  user: 'root',             // Your DB username
  password: 'Justmaths123',             // Your DB passwor
  database: 'project216', // Your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
