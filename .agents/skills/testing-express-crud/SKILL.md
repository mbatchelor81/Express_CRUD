# Testing Express_CRUD App

## Prerequisites

- PostgreSQL server running locally (`sudo systemctl start postgresql`)
- Node.js installed (v18+)
- `crud_express` database and `users` table created
- `.env` file with `PG_HOST`, `PG_USER`, `PG_PASS`, `PG_PORT`, `PG_DATABASE` configured

## Devin Secrets Needed

No external secrets needed. Local PostgreSQL credentials are generated during environment initialization and stored in `.env` and `$ENVRC`.

## Database Setup

If the database isn't already set up:

```bash
sudo systemctl start postgresql
DB_PASS=$(openssl rand -base64 12)
sudo -u postgres psql -c "CREATE USER crud_user WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "CREATE DATABASE crud_express OWNER crud_user;"
sudo -u postgres psql -d crud_express -c "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(256) NOT NULL, email VARCHAR(256) NOT NULL, phone_no VARCHAR(26));"
```

## Running the App

```bash
npm start          # or: node app.js
# App listens on port 3000
```

Verify: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` should return `200`.

## Running Tests

```bash
npm test           # runs jest --detectOpenHandles
```

Expected: 7 tests pass (GET /, GET /add, GET /frontend, POST /save, GET /edit/:id, POST /update, GET /delete/:id). Jest should exit cleanly without `--forceExit`.

## Browser Testing (CRUD Lifecycle)

1. **Index page** (`/`): Shows a table with columns id, Name, Email, Phone No, Action. A red "Create user" button links to `/add`.
2. **Create** (`/add`): Form with Name, Email, Phone No fields. Submitting POSTs to `/save` and redirects to `/`.
3. **Edit** (`/edit/:id`): Form pre-filled with user data. Submitting POSTs to `/update` and redirects to `/`.
4. **Delete** (`/delete/:id`): Clicking Delete on a row immediately deletes and redirects to `/`.

## Common Issues

- **PostgreSQL auth errors**: Ensure the user has the correct password and permissions. Check `pg_hba.conf` if you see authentication failures.
- **Port 3000 in use**: Kill existing process: `kill $(ss -tlnp | grep 3000 | grep -oP 'pid=\K[0-9]+')`
- **Tests require a running PostgreSQL instance** with the `crud_express` database and `users` table
