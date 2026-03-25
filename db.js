const mysql = require('mysql2');
require('dotenv').config();

const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'crud_express'
});

mysqlConnection.connect(function(error) {
    error ? console.log(error) : console.log('MySQL Database connected!');
});

function query(sql, params, callback) {
    mysqlConnection.query(sql, params, callback);
}

function close(callback) {
    if (mysqlConnection) {
        mysqlConnection.end(callback);
    } else {
        if (callback) callback();
    }
}

module.exports = {
    query,
    close
};
