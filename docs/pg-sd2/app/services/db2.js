require("dotenv").config();
const mysql = require('mysql2/promise');

const poolNew = mysql.createPool({
  host: process.env.DB_CONTAINER,
  port: process.env.DB_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
});

async function query(sql, params) {
  const [rows] = await poolNew.execute(sql, params);
  return rows;
}

module.exports = {
  query,
};