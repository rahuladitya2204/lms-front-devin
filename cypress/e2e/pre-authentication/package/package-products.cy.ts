describe('Package Page', () => {
    const appUrl = Cypress.env('appUrl');
    beforeEach(() => {
        cy.visit(`${appUrl}/test-series/test-package/products`)
    })

    it('should display products', () => {
        cy.contains(`What's included`).click()
        cy.get('.test-product-card', { timeout: 20000 }).should('be.visible')
    })

    it('show syllabus should work', () => {
        cy.visit(`${appUrl}/test-series/test-package/products`)
        cy.get('.test-product-card', { timeout: 20000 }).should('be.visible')
        cy.get('.show-syllabus-button').should('be.visible')
        // add show syllabus test here
    })

})