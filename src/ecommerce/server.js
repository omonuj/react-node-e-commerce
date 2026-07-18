const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');

// db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'))
    .catch(err => console.error('DB connection error:', err.message));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
