import mysql from 'mysql2';
//import app from 'app.js';
//import env from './.env';
import dotenv from 'dotenv';

dotenv.config();

console.log('DB_USER:', process.env.DB_USER);
//console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_NAME:', process.env.DB_NAME);


const db = mysql.createConnection({
//const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}); //  database: 'to_do_db'

// Conectando a la base de datos

//db.connect(err => {
//  if (err) throw err;
//  console.log('database mySql conectada');
//});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connectado a database MySQL');
});

//app.locals.db = db;

export default db;