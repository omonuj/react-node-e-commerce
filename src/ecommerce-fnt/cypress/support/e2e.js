// Loaded automatically before every e2e spec file.
// Add global behaviour / custom commands here.

// The legacy CRA app can emit benign ResizeObserver / third-party errors that
// would otherwise fail a test; ignore those so specs only fail on real issues.
Cypress.on('uncaught:exception', err => {
    if (/ResizeObserver|Braintree|dropin/i.test(err.message)) {
        return false;
    }
    return true;
});
