const request = require('supertest');
const app = require('../app');

// `/api/secret` is guarded purely by `requireSignin` (express-jwt), so it is a
// clean check of the auth layer with no database or route-param loader involved.
// (Routes with a :userId run the `userById` param loader first, which hits the
// DB, so they are not suitable for a pure auth-guard assertion.)
describe('requireSignin auth guard on GET /api/secret', () => {
    it('returns 401 when no token is provided', async () => {
        const res = await request(app).get('/api/secret');
        expect(res.status).toBe(401);
    });

    it('returns 401 when the Authorization header is malformed', async () => {
        const res = await request(app)
            .get('/api/secret')
            .set('Authorization', 'Bearer not-a-real-jwt');
        expect(res.status).toBe(401);
    });

    it('does not leak the protected payload without a valid token', async () => {
        const res = await request(app).get('/api/secret');
        expect(res.body.user).toBeUndefined();
    });
});
