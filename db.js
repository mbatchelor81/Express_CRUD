const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME || 'crud_express',
    port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        console.log(err);
    } else {
        console.log('PostgreSQL Database connected!');
        release();
    }
});

function query(sql, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    pool.query(sql, params, (err, result) => {
        callback(err, result ? result.rows : null);
    });
}

function close(callback) {
    pool.end().then(() => {
        if (callback) callback();
    }).catch(callback);
}

module.exports = {
    query,
    close
};
