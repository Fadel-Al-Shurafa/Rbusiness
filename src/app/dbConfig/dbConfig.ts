import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306, // Specify the port as a number, not a string
  user: 'root',
  password: process.env.MYSQL_P,
  database: 'test'
});

export default pool;