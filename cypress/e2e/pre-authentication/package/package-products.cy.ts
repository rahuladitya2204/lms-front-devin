describe('Package Page', () => {
    beforeEach(() => {
        cy.visit('http://www.nimblebee.local:3000/test-series/test-package/products')
    })

    it.skip('Should display products page', () => {
        cy.get('.test-product-card').should('be.visible')
    })

    it('Should display syllabus', () => {
        cy.get('.show-syllabus-button').eq(0).should('be.visible').click()
    })

})