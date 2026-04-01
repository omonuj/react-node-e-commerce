const { defineConfig } = require('cypress');

module.exports = defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        supportFile: 'cypress/support/e2e.js',
        specPattern: 'cypress/e2e/**/*.cy.js',
        video: false,
        // The dev server can be slow to boot on first compile.
        defaultCommandTimeout: 8000,
        setupNodeEvents(on, config) {
            return config;
        }
    }
});
