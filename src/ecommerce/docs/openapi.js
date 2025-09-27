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
                properties: {
                    order: {
                        type: 'object',
                        properties: {
                            products: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                            transaction_id: { type: 'string' },
                            amount: { type: 'number', example: 129.99 },
                            address: { type: 'string', example: '123 Main St' }
                        }
                    }
                }
            },
            PaymentRequest: {
                type: 'object',
                required: ['paymentMethodNonce', 'amount'],
                properties: {
                    paymentMethodNonce: { type: 'string', example: 'fake-valid-nonce' },
                    amount: { type: 'number', example: 129.99 }
                }
            }
        },
        responses: {
            Unauthorized: {
                description: 'Missing or invalid JWT',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            },
            Forbidden: {
                description: 'Authenticated but not allowed (isAuth / isAdmin)',
                content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
            }
        }
    },
    paths: {
        '/signup': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SignupRequest' } } }
                },
                responses: {
                    200: {
                        description: 'Created user',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: { user: { $ref: '#/components/schemas/User' } }
                                }
                            }
                        }
                    },
                    400: {
                        description: 'Validation error or email taken',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
                    }
                }
            }
        },
        '/signin': {
            post: {
                tags: ['Auth'],
                summary: 'Sign in and receive a JWT',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SigninRequest' } } }
                },
                responses: {
                    200: {
                        description: 'Authenticated',
                        content: { 'application/json': { schema: { $ref: '#/components/schemas/SigninResponse' } } }
                    },
                    400: { description: 'No user with that email', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    401: { description: 'Email and password do not match', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/signout': {
            get: {
                tags: ['Auth'],
                summary: 'Clear the auth cookie',
                responses: {
                    200: { description: 'Signed out', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } }
                }
            }
        },
        '/secret': {
            get: {
                tags: ['User'],
                summary: 'Auth smoke-test endpoint',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { user: { type: 'string' } } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' }
                }
            }
        },
        '/user/{userId}': {
            get: {
                tags: ['User'],
                summary: 'Get a user profile',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            },
            put: {
                tags: ['User'],
                summary: 'Update a user profile',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    password: { type: 'string' },
                                    about: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            }
        },
        '/orders/by/user/{userId}': {
            get: {
                tags: ['User'],
                summary: 'Purchase history for a user',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Orders', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Order' } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            }
        },
        '/categories': {
            get: {
                tags: ['Category'],
                summary: 'List all categories',
                responses: {
                    200: { description: 'Categories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } }
                }
            }
        },
        '/category/{categoryId}': {
            get: {
                tags: ['Category'],
                summary: 'Get a category by id',
                parameters: [{ name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Category', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    400: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/category/create/{userId}': {
            post: {
                tags: ['Category'],
                summary: 'Create a category (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryRequest' } } } },
                responses: {
                    200: { description: 'Created', content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Category' } } } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            }
        },
        '/category/{categoryId}/{userId}': {
            put: {
                tags: ['Category'],
                summary: 'Update a category (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } },
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryRequest' } } } },
                responses: {
                    200: { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            },
            delete: {
                tags: ['Category'],
                summary: 'Delete a category (admin)',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'categoryId', in: 'path', required: true, schema: { type: 'string' } },
                    { name: 'userId', in: 'path', required: true, schema: { type: 'string' } }
                ],
                responses: {
                    200: { description: 'Deleted', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
                    400: { description: 'Has associated products', content: { 'application/json': { schema: { $ref: '#/components/schemas/Message' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            }
        },
        '/products': {
            get: {
                tags: ['Product'],
                summary: 'List products',
                parameters: [
                    { name: 'sortBy', in: 'query', schema: { type: 'string', default: '_id' }, description: 'e.g. sold, createdAt' },
                    { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 6 } }
                ],
                responses: {
                    200: { description: 'Products', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } }
                }
            }
        },
        '/products/search': {
            get: {
                tags: ['Product'],
                summary: 'Search products by name and category',
                parameters: [
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category id or "All"' }
                ],
                responses: {
                    200: { description: 'Products', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } }
                }
            }
        },
        '/products/related/{productId}': {
            get: {
                tags: ['Product'],
                summary: 'List products related to a product (same category)',
                parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Products', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Product' } } } } }
                }
            }
        },
        '/products/categories': {
            get: {
                tags: ['Product'],
                summary: 'List category ids that have products',
                responses: {
                    200: { description: 'Category ids', content: { 'application/json': { schema: { type: 'array', items: { type: 'string' } } } } }
                }
            }
        },
        '/products/by/search': {
            post: {
                tags: ['Product'],
                summary: 'Filtered product search (category + price range)',
                requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductSearchRequest' } } } },
                responses: {
                    200: {
                        description: 'Products',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        size: { type: 'integer' },
                                        data: { type: 'array', items: { $ref: '#/components/schemas/Product' } }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/product/{productId}': {
            get: {
                tags: ['Product'],
                summary: 'Get a product by id (photo omitted)',
                parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Product', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                    400: { description: 'Not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
                }
            }
        },
        '/product/create/{userId}': {
            post: {
                tags: ['Product'],
                summary: 'Create a product (admin, multipart)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                required: ['name', 'description', 'price', 'category'],
                                properties: {
                                    name: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    category: { type: 'string', description: 'Category id' },
                                    quantity: { type: 'integer' },
                                    shipping: { type: 'boolean' },
                                    photo: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Created product', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
                    400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
                    401: { $ref: '#/components/responses/Unauthorized' },
                    403: { $ref: '#/components/responses/Forbidden' }
                }
            }
        },
