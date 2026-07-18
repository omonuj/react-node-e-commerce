const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();
// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');
// api docs
const openapiSpec = require('./docs/openapi');
const { swaggerHtml } = require('./docs/swaggerUi');

// app
const app = express();

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// api docs: raw spec + Swagger UI (CDN-rendered, Vercel-friendly)
app.get('/api-docs.json', (req, res) => res.json(openapiSpec));
app.get('/api-docs', (req, res) => {
    res.type('html').send(swaggerHtml('/api-docs.json', openapiSpec.info.title));
});

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);

// export the app so it can be started (server.js) or imported by tests
module.exports = app;
