describe('Package Page', () => {
    it('Should display package content', () => {
        cy.visit('http://www.nimblebee.local:3000/test-series/test-package?hide_popup=true')
        cy.contains('Test Package Title').should('be.visible')
        cy.contains('Test Package Landing Page').should('be.visible')
        cy.contains(`What's included`).click()
        cy.get('.test-product-card', { timeout: 15000 }).should('be.visible')

    })
})