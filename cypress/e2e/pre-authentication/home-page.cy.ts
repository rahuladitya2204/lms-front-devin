describe('Home Page', () => {
    const appUrl = Cypress.env('appUrl');
    beforeEach(() => {
        cy.visit(`${appUrl}`)
    })

    it('Should display login button when not authenticated', () => {
        cy.contains('Login').should('be.visible')
        cy.contains('Copyright')
        cy.contains('Privacy Policy')
        cy.contains('Follow us on')
    })

})