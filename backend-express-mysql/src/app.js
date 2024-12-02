import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
//import mysql from 'mysql2';
//import db from '../db/db.js'
//import forms from './forms';
//const cors = require('cors');
//const bodyParser = require('body-parser');
//const path = require('path');
dotenv.config();
const app = express();
const port = 3000;
// const __dirname = path.dirname(new URL(import.meta.url).pathname);
//app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const basePath = 'C:\\Users\\hogar\\Desktop\\cilsa-tpfinal\\frontend';
//const indexPath = path.join(basePath, 'public', 'index.html');  
app.use(express.static(path.join(basePath, 'public')));
//app.locals.db = db;
// Routes
app.use('/', routes);

export default app;


