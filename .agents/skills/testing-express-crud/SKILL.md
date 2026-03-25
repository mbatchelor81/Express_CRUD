# Testing Express_CRUD App

## Prerequisites

- MySQL server running locally (`sudo systemctl start mysql`)
- Node.js installed (v18+)
- `crud_express` database and `users` table created
- `.env` file with `DB_HOST`, `DB_USER`, `DB_PASS` configured

## Devin Secrets Needed

No external secrets needed. Local MySQL credentials are generated during environment initialization and stored in `.env` and `$ENVRC`.

## Database Setup

If the database isn't already set up:

```bash
sudo systemctl start mysql
DB_PASS=$(openssl rand -base64 12)
sudo mysql -e "CREATE USER IF NOT EXISTS 'crud_user'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASS';"
sudo mysql -e "CREATE DATABASE IF NOT EXISTS crud_express;"
sudo mysql -e "GRANT ALL PRIVILEGES ON crud_express.* TO 'crud_user'@'localhost'; FLUSH PRIVILEGES;"
sudo mysql crud_express -e "CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(256) NOT NULL, email VARCHAR(256) NOT NULL, phone_no VARCHAR(26));"
```

Note: Use `mysql_native_password` auth plugin — the default `caching_sha2_password` may cause `ER_ACCESS_DENIED_ERROR` with the mysql2 Node.js driver.

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

- **MySQL auth errors**: If you see `ER_ACCESS_DENIED_ERROR`, the user might be using `caching_sha2_password`. Fix with: `ALTER USER 'crud_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';`
- **Port 3000 in use**: Kill existing process: `kill $(ss -tlnp | grep 3000 | grep -oP 'pid=\K[0-9]+')`
- **Tests require a running MySQL instance** with the `crud_express` database and `users` table
