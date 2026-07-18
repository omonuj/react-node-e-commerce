require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// local / traditional server: connect then listen
connectDB()
    .then(() => console.log('DB Connected'))
    .catch(err => console.error('DB connection error:', err.message));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
