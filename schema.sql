-- PostgreSQL schema for Express_CRUD
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone_no VARCHAR(26)
);
