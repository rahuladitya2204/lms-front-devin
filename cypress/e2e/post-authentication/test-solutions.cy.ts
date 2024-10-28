describe('Test Solutions', () => {
    beforeEach(async () => {
        await cy.apiRequest({ method: 'POST', url: 'user/test/create-test-answers' })
        cy.visit('http://www.nimblebee.local:3000/app/test/test/review');
        cy.loginLearner();
    })

    it('is working', () => {
        cy.url().should('include', '/review');
        cy.get('#next-button').click()
        cy.get('#next-button').click()
        cy.get('#previous-button').click()
        cy.get('#previous-button').click()
    })
})