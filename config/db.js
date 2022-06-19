const mysql = require('mysql');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE

const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DATABASE,
  password: DB_PASSWORD,
});
db.connect((err)=>{
  if(err) throw err;
  console.log("db connected successful:" + db.threadId);
});

module.exports = db;