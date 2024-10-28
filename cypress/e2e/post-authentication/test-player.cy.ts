describe('Test Player', () => {
    beforeEach(async () => {
        await cy.apiRequest({ method: 'POST', url: 'user/test/create-package-enrollment' })
        cy.visit('http://www.nimblebee.local:3000/app/test/test/start');
        cy.loginLearner();
    })

    it('is working', () => {
        cy.get('#start-test').should('be.visible');
        cy.get('input[type=checkbox]').click({ multiple: true })
        cy.get('#start-test').click()
        cy.submitTestAnswer();
        cy.submitTestAnswer(1);
        cy.submitTestAnswer(2);
        cy.submitTestAnswer(3);


        // cy.get('.enrolled-test-item', { timeout: 30000 }).should('be.visible')
    })

    // it('Start test button is working', () => {
    //     // cy.get('.start-test-button', { timeout: 10000 }).should('be.visible').eq(0).click();
    //     cy.url().should('include', '/start');
    // })
})