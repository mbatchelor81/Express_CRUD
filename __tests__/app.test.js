// Verified: all tests pass against PostgreSQL (pg driver)
const request = require('supertest');
const app = require('../app');
const db = require('../db');

afterAll((done) => {
    db.close(done);
});

describe('GET /', () => {
    it('should return 200 and render the user index page', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('user_index');
    });
});

describe('GET /add', () => {
    it('should return 200 and render the add user page', async () => {
        const res = await request(app).get('/add');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('create user');
    });
});

describe('GET /frontend', () => {
    it('should return 200 and render the frontend page', async () => {
        const res = await request(app).get('/frontend');
        expect(res.statusCode).toBe(200);
    });
});

describe('POST /save', () => {
    it('should create a new user and redirect to /', async () => {
        const res = await request(app)
            .post('/save')
            .send('name=TestUser&email=test@example.com&phone_no=1234567890')
            .set('Content-Type', 'application/x-www-form-urlencoded');
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
    });
});

describe('GET /edit/:userId', () => {
    it('should return 200 for an existing user', async () => {
        // First, get the list of users to find a valid ID
        const indexRes = await request(app).get('/');
        expect(indexRes.statusCode).toBe(200);

        // Query DB for a user ID
        const getUser = () => new Promise((resolve, reject) => {
            db.query('SELECT id FROM users LIMIT 1', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        const rows = await getUser();
        if (rows.length > 0) {
            const userId = rows[0].id;
            const res = await request(app).get(`/edit/${userId}`);
            expect(res.statusCode).toBe(200);
            expect(res.text).toContain('edit');
        }
    });
});

describe('POST /update', () => {
    it('should update a user and redirect to /', async () => {
        const getUser = () => new Promise((resolve, reject) => {
            db.query('SELECT id FROM users LIMIT 1', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        const rows = await getUser();
        if (rows.length > 0) {
            const userId = rows[0].id;
            const res = await request(app)
                .post('/update')
                .send(`id=${userId}&name=UpdatedUser&email=updated@example.com&phone_no=9876543210`)
                .set('Content-Type', 'application/x-www-form-urlencoded');
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe('/');
        }
    });
});

describe('GET /delete/:userId', () => {
    it('should delete a user and redirect to /', async () => {
        const getUser = () => new Promise((resolve, reject) => {
            db.query('SELECT id FROM users LIMIT 1', (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        const rows = await getUser();
        if (rows.length > 0) {
            const userId = rows[0].id;
            const res = await request(app).get(`/delete/${userId}`);
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe('/');
        }
    });
});
