describe('Home Page', () => {
    beforeEach(() => {
        cy.visit('http://www.nimblebee.local:3000')
    })

    it('Should display login button when not authenticated', () => {
        cy.contains('Login').should('be.visible')
        cy.contains('Copyright')
        cy.contains('Privacy Policy')
        cy.contains('Follow us on')
    })

})