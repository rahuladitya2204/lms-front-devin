describe('Test Result Player', () => {
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

        cy.get('#submit-test-button').click()

        cy.contains('Yes', { timeout: 3000 }).click();
        cy.get('div[role=radio]').eq(2).click();
        cy.get('#submit-review-text-input').type('good test')
        cy.get('#submit-review-button').click()
    })
})