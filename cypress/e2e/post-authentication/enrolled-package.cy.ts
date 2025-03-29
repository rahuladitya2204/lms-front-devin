describe('Enrolled Packages details', () => {
    const appUrl = Cypress.env('appUrl');
    beforeEach(async () => {
        await cy.apiRequest({ method: 'POST', url: 'user/test/create-package-enrollment' })
        cy.visit(`${appUrl}/app/test-package/enrolled-package`)
        cy.loginLearner();
    })

    it('Tests are displaying', () => {
        cy.get('.enrolled-test-item', { timeout: 30000 }).should('be.visible')
    })

    it('Start test button is working', () => {
        cy.get('.start-test-button', { timeout: 10000 }).should('be.visible').eq(0).click();
        cy.url().should('include', '/start');
    })
})