// End-to-end signin flow. Stub the `signin` API and assert the app stores the
// returned token and redirects a normal user to their dashboard.
describe('signin flow', () => {
    beforeEach(() => {
        cy.visit('/signin');
    });

    it('shows the API error for invalid credentials', () => {
        cy.intercept('POST', '**/signin', {
            statusCode: 401,
            body: { error: 'Email and password dont match' }
        }).as('signin');

        cy.get('input[type="email"]').type('nobody@example.com');
        cy.get('input[type="password"]').type('wrongpass');
        cy.contains('button', 'Submit').click();

        cy.wait('@signin');
        cy.get('.alert-danger')
            .should('be.visible')
            .and('contain', 'Email and password dont match');
    });

    it('stores the token and redirects a normal user to the dashboard', () => {
        cy.intercept('POST', '**/signin', {
            statusCode: 200,
            body: {
                token: 'fake.jwt.token',
                user: { _id: 'u1', name: 'Normal User', email: 'user@example.com', role: 0 }
            }
        }).as('signin');
        // dashboard data calls after redirect — stub so the page renders cleanly
        cy.intercept('GET', '**/orders/by/user/**', { body: [] });

        cy.get('input[type="email"]').type('user@example.com');
        cy.get('input[type="password"]').type('secret1');
        cy.contains('button', 'Submit').click();

        cy.wait('@signin');
        cy.location('pathname').should('eq', '/user/dashboard');
        cy.window().then(win => {
            const jwt = JSON.parse(win.localStorage.getItem('jwt'));
            expect(jwt).to.have.property('token', 'fake.jwt.token');
            expect(jwt.user).to.have.property('role', 0);
        });
    });
});
