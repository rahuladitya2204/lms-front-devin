describe('Enrolled Packages details', () => {
    beforeEach(() => {
        cy.visit('http://www.nimblebee.local:3000/app/test-series/test-package/enrolled-package').wait(10000)
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