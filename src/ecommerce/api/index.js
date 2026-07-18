// Vercel serverless entry point.
//
// Vercel turns this file into a serverless function. The Express `app` is itself a
// (req, res) handler, so we delegate to it. We kick off the DB connection but do
// NOT await it here: awaiting would block non-DB routes (like /api-docs) whenever
// the database is slow or misconfigured. Mongoose buffers model operations until
// the connection is ready, so DB routes still work once connected.
require('dotenv').config();
const app = require('../app');
const connectDB = require('../config/db');

module.exports = (req, res) => {
    // Fire-and-forget; errors are logged, not thrown, so the function never hangs.
    connectDB().catch(err => console.error('DB connection error:', err.message));
    return app(req, res);
};
