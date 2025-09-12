// Provide the env vars the app expects so modules load cleanly under test.
// These are dummy values — no real secrets and no database connection are used.
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.BRAINTREE_MERCHANT_ID = process.env.BRAINTREE_MERCHANT_ID || 'test-merchant';
process.env.BRAINTREE_PUBLIC_KEY = process.env.BRAINTREE_PUBLIC_KEY || 'test-public';
process.env.BRAINTREE_PRIVATE_KEY = process.env.BRAINTREE_PRIVATE_KEY || 'test-private';
