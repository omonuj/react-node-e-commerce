// End-to-end navigation flow through the public pages.
// Stub the product-listing calls the Home page makes so the app renders
// deterministically without a live backend/database.
describe('public navigation', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/products?sortBy=sold**', { body: [] }).as('bySold');
        cy.intercept('GET', '**/products?sortBy=createdAt**', { body: [] }).as('byArrival');
        cy.intercept('GET', '**/categories', { body: [] }).as('categories');
        cy.visit('/');
    });

    it('renders the main navigation menu', () => {
        cy.contains('.nav-link', 'Home').should('be.visible');
        cy.contains('.nav-link', 'Shop').should('be.visible');
        cy.contains('.nav-link', 'Cart').should('be.visible');
        cy.contains('.nav-link', 'Signin').should('be.visible');
        cy.contains('.nav-link', 'Signup').should('be.visible');
    });

    it('navigates to the Signin page', () => {
        cy.contains('.nav-link', 'Signin').click();
        cy.location('pathname').should('eq', '/signin');
        cy.contains('button', 'Submit').should('be.visible');
    });

    it('navigates to the Signup page', () => {
        cy.contains('.nav-link', 'Signup').click();
        cy.location('pathname').should('eq', '/signup');
        cy.contains('label', 'Name').should('be.visible');
        cy.contains('label', 'Email').should('be.visible');
        cy.contains('label', 'Password').should('be.visible');
    });

    it('navigates to the Shop page', () => {
        cy.intercept('GET', '**/categories', { body: [] });
        cy.intercept('GET', '**/products/search**', { body: { data: [], size: 0 } });
        cy.contains('.nav-link', 'Shop').click();
        cy.location('pathname').should('eq', '/shop');
    });
});
