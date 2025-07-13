// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',        // Database host
  user: 'root',             // Your DB username
  password: 'A132b59m!@#$PaUl',             // Your DB passwor
  database: 'demo', // Your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
