import mysql from 'mysql2';

// Create a connection to the MySQL server
const pool: any = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'usertest',
  port : 3306
});

pool.connect(function (err : any) {
  if (err) throw err;

  console.log("Database Connected");
});

export  { pool}