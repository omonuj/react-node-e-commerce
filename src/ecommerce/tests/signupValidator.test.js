const request = require('supertest');
const app = require('../app');

// The POST /api/signup route runs `userSignupValidator` BEFORE the controller
// touches the database, so these validation failures never hit MongoDB.
describe('POST /api/signup validation', () => {
    it('rejects a missing name', async () => {
        const res = await request(app)
            .post('/api/signup')
            .send({ email: 'valid@mail.com', password: 'secret1' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Name is required');
    });

    it('rejects an email without an @', async () => {
        const res = await request(app)
            .post('/api/signup')
            .send({ name: 'Jo', email: 'not-an-email', password: 'secret1' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Email must contain @');
    });

    it('rejects a password shorter than 6 characters', async () => {
        const res = await request(app)
            .post('/api/signup')
            .send({ name: 'Jo', email: 'valid@mail.com', password: 'a1' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Password must contain at least 6 characters');
    });

    it('rejects a password with no number', async () => {
        const res = await request(app)
            .post('/api/signup')
            .send({ name: 'Jo', email: 'valid@mail.com', password: 'abcdef' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Password must contain a number');
    });
});
