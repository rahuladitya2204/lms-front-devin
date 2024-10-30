describe('Enroll for Package', () => {
    const appUrl = Cypress.env('appUrl');
    beforeEach(() => {
        cy.visit(`${appUrl}/test-series/test-package`)
    })

    it('Should able to see Login to access button', () => {
        cy.get('.login-to-access-button', { timeout: 30000 }).as('enroll-btn').should('be.visible')
        cy.get('@enroll-btn').should('be.visible')
    })

    it('should be able to enrolled for package', () => {
        // console.log(response, 'ssss')
        cy.get('.login-to-access-button', { timeout: 20000 }).eq(1).as('enroll-btn').should('be.visible')
        cy.get('@enroll-btn').click()
        cy.loginLearner();
        cy.get('#enroll-button').click({ force: true })
        // cy.get('#go-to-package-button', { timeout: 10000 }).click({ force: true })
    })
})