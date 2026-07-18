// Vercel serverless entry point.
//
// Vercel turns this file into a serverless function. The Express `app` is itself a
// (req, res) handler, so we ensure the DB is connected (cached across invocations)
// and then delegate to it. If the DB connection fails we still hand off to the app
// so that /api-docs and other non-DB routes keep working.
require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');

module.exports = async (req, res) => {
    try {
        await connectDB();
    } catch (err) {
        console.error('DB connection error:', err.message);
    }
    return app(req, res);
};
