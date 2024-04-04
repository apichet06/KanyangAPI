require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool(process.env.DATABASE_URL)

pool.getConnection(function (err, connection) {
    if (err) {
        console.log('Error getting connection from database  ' + err.message);
        return;
    }
    console.log('Connection DB Successfully');
    connection.release();
})

module.exports = pool.promise()