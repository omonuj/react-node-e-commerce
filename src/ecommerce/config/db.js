const mongoose = require('mongoose');

// Cache the connection across serverless invocations. On Vercel each function
// invocation may reuse the same Node process, so we avoid opening a new
// connection on every request (which would exhaust MongoDB connections).
let cached = global._mongoose;
if (!cached) {
    cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        if (!process.env.DATABASE) {
            throw new Error('DATABASE env var is not set');
        }
        cached.promise = mongoose
            .connect(process.env.DATABASE, {
                useNewUrlParser: true,
