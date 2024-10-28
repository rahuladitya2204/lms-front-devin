describe('Test Result Player', () => {
  const appUrl = Cypress.env('appUrl');
  beforeEach(async () => {
    await cy.apiRequest({ method: 'POST', url: 'user/test/create-test-answers' })
    cy.visit(`${appUrl}/app/test/test/result`);
    cy.loginLearner();
  })

  it('is working', () => {
    cy.url().should('include', '/result');
    cy.contains('Test Result')
    cy.get('#exit-button').should('be.visible')
    cy.get('#view-solutions-button').should('be.visible')
    cy.get('#completed-card').should('be.visible')
    cy.get('#accuracy-card').should('be.visible')
    cy.get('#over-performance-card').should('be.visible')
    cy.get('#topic-wise-card').should('be.visible')
  })
})