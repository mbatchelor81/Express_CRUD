const { Pool } = require('pg');
require('dotenv').config();

const DB_TYPE = process.env.DB_TYPE || 'postgres';

let pgPool;

if (DB_TYPE === 'postgres') {
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
}

function close(callback) {
    if (pgPool) {
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
