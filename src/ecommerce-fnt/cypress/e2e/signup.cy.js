// End-to-end signup flow. The form posts to the backend `signup` API; we stub
// that single call with cy.intercept so the browser exercises the real React
// component (state, validation display, success view) without a live server.
describe('signup flow', () => {
    beforeEach(() => {
        cy.visit('/signup');
    });

    it('shows the error returned by the API when the email is taken', () => {
        cy.intercept('POST', '**/signup', {
            statusCode: 400,
            body: { error: 'Email is taken' }
        }).as('signup');

        cy.get('input[type="text"]').type('Jane Doe');
        cy.get('input[type="email"]').type('taken@example.com');
        cy.get('input[type="password"]').type('secret1');
        cy.contains('button', 'Submit').click();

        cy.wait('@signup');
        cy.get('.alert-danger').should('be.visible').and('contain', 'Email is taken');
    });

    it('shows the success message and clears the form on a successful signup', () => {
        cy.intercept('POST', '**/signup', {
            statusCode: 200,
            body: { user: { _id: 'abc123', name: 'Jane Doe', email: 'jane@example.com' } }
        }).as('signup');

        cy.get('input[type="text"]').type('Jane Doe');
        cy.get('input[type="email"]').type('jane@example.com');
        cy.get('input[type="password"]').type('secret1');
        cy.contains('button', 'Submit').click();

        cy.wait('@signup');
        cy.get('.alert-info')
            .should('be.visible')
            .and('contain', 'New account is created');
        // form fields are reset after success
        cy.get('input[type="email"]').should('have.value', '');
    });
});
