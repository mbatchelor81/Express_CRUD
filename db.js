const mysql = require('mysql2');
const { Pool } = require('pg');
require('dotenv').config();

const DB_TYPE = process.env.DB_TYPE || 'mysql';

let mysqlConnection;
let pgPool;

if (DB_TYPE === 'mysql') {
    mysqlConnection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'crud_express'
    });

    mysqlConnection.connect(function(error) {
        error ? console.log(error) : console.log('MySQL Database connected!');
    });
} else if (DB_TYPE === 'postgres') {
    pgPool = new Pool({
        host: process.env.PG_HOST,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        port: process.env.PG_PORT,
        database: 'crud_express'
    });

    pgPool.on('connect', () => {
        console.log('PostgreSQL Database connected!');
    });

    pgPool.on('error', (err) => {
        console.error('PostgreSQL connection error:', err);
    });
}

function query(sql, params, callback) {
    if (DB_TYPE === 'mysql') {
        mysqlConnection.query(sql, params, callback);
    } else if (DB_TYPE === 'postgres') {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        pgPool.query(sql, params, (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result.rows);
        });
    } else {
        throw new Error(`Unsupported database type: ${DB_TYPE}`);
    }
}

function close(callback) {
    if (DB_TYPE === 'mysql' && mysqlConnection) {
        mysqlConnection.end(callback);
    } else if (DB_TYPE === 'postgres' && pgPool) {
        pgPool.end().then(() => callback()).catch(callback);
    } else {
        if (callback) callback();
    }
}

module.exports = {
    query,
    close,
    DB_TYPE
};
