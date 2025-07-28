// db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,        // Railway database host
  port: process.env.DB_PORT,        // Railway database port
  user: process.env.DB_USER,        // Railway DB username
  password: process.env.DB_PASSWORD, // Railway DB password
  database: process.env.DB_NAME,    // Railway DB name
  ssl: {
    rejectUnauthorized: false       // Railway requires SSL
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to Railway MySQL database successfully!');
    connection.release();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}

testConnection();

module.exports = pool;