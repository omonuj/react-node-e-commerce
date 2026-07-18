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
                useCreateIndex: true,
                // Fail fast instead of hanging the serverless function when the
                // cluster is unreachable / credentials are wrong.
                serverSelectionTimeoutMS: 8000
            })
            .then(m => m)
            .catch(err => {
                // Reset so the next request retries instead of reusing a rejected promise.
                cached.promise = null;
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};

module.exports = connectDB;
