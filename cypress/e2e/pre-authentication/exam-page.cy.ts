describe('Exam Page', () => {
    beforeEach(() => {
        cy.visit('http://www.nimblebee.local:3000/exam/test-category?hide_popup=true')
    })

    it.skip('Should display main exam page content', () => {
        cy.contains('Registration Date').should('be.visible')
        cy.contains('Salary').should('be.visible')
        cy.contains('Vacancies').should('be.visible')
        cy.contains('Important Resources').should('be.visible')
        cy.get('.important-resources-button').should('be.visible')
        cy.get('Landing Page Text').should('be.visible')
    })

    it('is exam page navigation tabs working', () => {
        cy.contains(`Important Link`).click();
        cy.wait(20000);
        cy.url().should('eq', '/exam/test-category/important-link');
    })

})