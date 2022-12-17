const mysql = require('mysql2/promise');

const db = mysql.createConnection({
  host: 'localhost',
  // Your mysql username
  user: 'root',
  // Your mysql password
  password: '!1Fatcat11',
  database: 'employees_db'
});

module.exports = db;