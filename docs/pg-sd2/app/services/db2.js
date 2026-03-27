require("dotenv").config();
const mysql = require('mysql2/promise');

const poolNew = mysql.createPool({
  host: process.env.DB_CONTAINER,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'coursework', // your new DB
});

// Query function (same pattern as your original db.js)
async function query(sql, params) {
  const [rows] = await poolNew.execute(sql, params);
  return rows;
}

module.exports = {
  query,
};