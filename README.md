# Express_CRUD

A Node.js web application for performing Create, Read, Update, and Delete (CRUD) operations on a MySQL database using Express and EJS templates.

![banner](https://user-images.githubusercontent.com/27864374/132133123-5b59f84a-a3e2-46f9-8111-08317c74a075.png)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: [Express](https://expressjs.com/) v4.17
- **Database**: MySQL via [mysql2](https://www.npmjs.com/package/mysql2) v2.3
- **View Engine**: [EJS](https://ejs.co/) v3.1 (server-side rendered templates)
- **Front-end**: Bootstrap 4
- **Testing**: [Jest](https://jestjs.io/) v30 + [Supertest](https://www.npmjs.com/package/supertest) v7
- **Environment**: [dotenv](https://www.npmjs.com/package/dotenv) for secrets management

## Project Structure

```
Express_CRUD/
├── app.js              # Express server, routes, and middleware
├── db.js               # MySQL connection pool and query/close helpers
├── package.json        # Dependencies and scripts
├── .env                # Database credentials (not committed)
├── views/
│   ├── user_index.ejs  # Dashboard — lists all users in a table
│   ├── user_add.ejs    # Form to create a new user
│   ├── user_edit.ejs   # Form to edit an existing user
│   └── frontend_page.ejs # Static front-end test page
├── public/
│   ├── css/styles.css  # Custom styles
│   └── img/            # Static images
└── __tests__/
    └── app.test.js     # Integration tests for all routes
```

## Routes

| Method | Path              | Description                          |
|--------|-------------------|--------------------------------------|
| GET    | `/`               | List all users from the `users` table |
| GET    | `/add`            | Render the "Create User" form        |
| POST   | `/save`           | Insert a new user, redirect to `/`   |
| GET    | `/edit/:userId`   | Render the "Edit User" form          |
| POST   | `/update`         | Update an existing user, redirect to `/` |
| GET    | `/delete/:userId` | Delete a user by ID, redirect to `/` |
| GET    | `/frontend`       | Static front-end test page           |

## Prerequisites

- **Node.js** (v14 or later recommended)
- **MySQL** server running locally (or remotely)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mbatchelor81/Express_CRUD.git
cd Express_CRUD
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up MySQL

Create the database and table in your MySQL instance:

```sql
CREATE DATABASE IF NOT EXISTS crud_express;
USE crud_express;

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NOT NULL,
    phone_no VARCHAR(26)
);
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password_here
```

### 5. Run the application

```bash
npm start
```

The server starts at [http://localhost:3000](http://localhost:3000).

For development with auto-restart:

```bash
npx nodemon app.js
```

## Database Module (`db.js`)

The database layer is separated into `db.js`, which:

- Creates a MySQL connection using credentials from `.env`
- Exports a `query(sql, params, callback)` function used by all routes
- Exports a `close(callback)` function for graceful shutdown (used in tests)

## Testing

Integration tests use Jest and Supertest to exercise every route:

```bash
npm test
```

This runs `jest --detectOpenHandles`, which tests:

- `GET /` — renders the user index page
- `GET /add` — renders the add user form
- `GET /frontend` — renders the static front-end page
- `POST /save` — creates a user and redirects
- `GET /edit/:userId` — renders the edit form for an existing user
- `POST /update` — updates a user and redirects
- `GET /delete/:userId` — deletes a user and redirects

> **Note**: Tests require a running MySQL instance with the `crud_express` database and `users` table set up.

## How It Works

### Architecture

The application follows a simple MVC pattern:

- **`app.js`** — Controller layer: defines all routes and middleware. Delegates database operations to `db.js` and renders EJS views.
- **`db.js`** — Model layer: manages the MySQL connection and exposes `query` and `close` methods.
- **`views/`** — View layer: EJS templates render HTML with data from the controller.

### Key Patterns

- **Post-Redirect-Get (PRG)**: The `POST /save` and `POST /update` routes redirect to `/` after writing to the database, preventing duplicate form submissions.
- **Static file serving**: The `public/` directory is served for CSS and images via `express.static`.
- **URL-encoded body parsing**: `express.urlencoded({ extended: false })` parses form submissions.
- **Modular exports**: `app.js` exports the Express app for testing. The server only listens when run directly (`require.main === module`).
