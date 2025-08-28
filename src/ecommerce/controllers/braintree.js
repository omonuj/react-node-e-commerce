const User = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

// Initialise the Braintree gateway lazily. Building it at module load throws
// ("Missing publicKey") when the BRAINTREE_* env vars are absent, which would
// crash the whole serverless function on Vercel. Instead we build it on first
// use and return a clean error if payments aren't configured.
let gatewayInstance = null;
const getGateway = () => {
    if (gatewayInstance) return gatewayInstance;
    const { BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY } = process.env;
    if (!BRAINTREE_MERCHANT_ID || !BRAINTREE_PUBLIC_KEY || !BRAINTREE_PRIVATE_KEY) {
        return null;
    }
    gatewayInstance = braintree.connect({
        environment: braintree.Environment.Sandbox, // Production
        merchantId: BRAINTREE_MERCHANT_ID,
        publicKey: BRAINTREE_PUBLIC_KEY,
        privateKey: BRAINTREE_PRIVATE_KEY
    });
    return gatewayInstance;
};

exports.generateToken = (req, res) => {
    const gateway = getGateway();
    if (!gateway) {
        return res.status(503).json({ error: 'Payments are not configured on this server' });
    }
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    const gateway = getGateway();
    if (!gateway) {
        return res.status(503).json({ error: 'Payments are not configured on this server' });
    }
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    // charge
    let newTransaction = gateway.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
