// Hand-written OpenAPI 3.0 spec.
//
// We intentionally do NOT use swagger-jsdoc's runtime file scanning: on Vercel's
// serverless bundler the JSDoc source globs often don't resolve, yielding an empty
// spec. A plain object is bundled with the function and always renders.

const openapiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'React + Node E-Commerce API',
        version: '1.0.0',
        description:
            'REST API for the MERN e-commerce app: authentication, users, categories, ' +
            'products, Braintree checkout, and orders. Protected routes use a JWT ' +
            'obtained from `POST /signin`, sent as `Authorization: Bearer <token>`.'
    },
    servers: [
        { url: '/api', description: 'Same-origin (works on Vercel and locally)' }
    ],
    tags: [
        { name: 'Auth', description: 'Sign up, sign in, sign out' },
        { name: 'User', description: 'User profile and purchase history' },
        { name: 'Category', description: 'Product categories' },
        { name: 'Product', description: 'Product catalog, search, and photos' },
        { name: 'Payment', description: 'Braintree checkout' },
        { name: 'Order', description: 'Order creation and management' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'JWT returned by `POST /signin`.'
            }
        },
        schemas: {
            Error: {
                type: 'object',
                properties: { error: { type: 'string', example: 'Access denied' } }
            },
            Message: {
                type: 'object',
                properties: { message: { type: 'string', example: 'Signout success' } }
            },
            SignupRequest: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string', maxLength: 32, example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', minLength: 6, example: 'secret123' }
                }
            },
            SigninRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    password: { type: 'string', example: 'secret123' }
                }
            },
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '652f1b2c9c1a4b0012345678' },
                    name: { type: 'string', example: 'Jane Doe' },
                    email: { type: 'string', format: 'email', example: 'jane@example.com' },
                    about: { type: 'string', example: 'I love shopping' },
                    role: { type: 'integer', description: '0 = user, 1 = admin', example: 0 },
                    history: { type: 'array', items: { type: 'object' } },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            SigninResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                    user: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            name: { type: 'string' },
                            email: { type: 'string', format: 'email' },
                            role: { type: 'integer' }
                        }
                    }
                }
            },
            Category: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '652f1b2c9c1a4b0012340001' },
                    name: { type: 'string', maxLength: 32, example: 'Laptops' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            CategoryRequest: {
                type: 'object',
                required: ['name'],
                properties: { name: { type: 'string', maxLength: 32, example: 'Laptops' } }
            },
            Product: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '652f1b2c9c1a4b0012340002' },
                    name: { type: 'string', maxLength: 32, example: 'MacBook Pro 14"' },
                    description: { type: 'string', maxLength: 2000 },
                    price: { type: 'number', example: 1999 },
                    category: { $ref: '#/components/schemas/Category' },
                    quantity: { type: 'integer', example: 10 },
                    sold: { type: 'integer', example: 3 },
                    shipping: { type: 'boolean', example: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            ProductSearchRequest: {
                type: 'object',
                properties: {
                    order: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
                    sortBy: { type: 'string', default: '_id', example: 'sold' },
                    limit: { type: 'integer', default: 100 },
                    skip: { type: 'integer', default: 0 },
                    filters: {
                        type: 'object',
                        description:
                            'Map of field -> value. For `price`, pass a [min, max] range; ' +
                            'for `category`, pass an array of category ids.',
                        example: { category: ['652f1b2c9c1a4b0012340001'], price: [0, 500] }
                    }
                }
            },
            CartItem: {
                type: 'object',
                properties: {
                    product: { type: 'string', description: 'Product id' },
                    name: { type: 'string' },
                    price: { type: 'number' },
                    count: { type: 'integer' }
                }
            },
            Order: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    products: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                    transaction_id: {},
                    amount: { type: 'number' },
                    address: { type: 'string' },
                    status: {
                        type: 'string',
                        enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
                    },
                    user: { type: 'string', description: 'User id' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            CreateOrderRequest: {
                type: 'object',
                required: ['order'],
