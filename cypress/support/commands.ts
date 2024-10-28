/// <reference types="cypress" />

import { getAxiosInstance } from "@Components/Editor/SunEditor/utils";
import axios from "axios";


// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('loginLearner', () => {
    const contactNo = Cypress.env('contactNo');
    cy.get('#enter-mobile-number', { timeout: 20000 }).focus().as('enter-mobile-number')
    cy.get('@enter-mobile-number').type(contactNo)
    cy.get('#send-otp').click();
    cy.get('#enter-otp').type('000000')
    cy.get('#verify-otp').click();
    cy.contains('OTP Verified')
});

Cypress.Commands.add('removeEnrollmentForPackage', async () => {
    await cy.apiRequest({ method: 'POST', url: 'user/test/remove-package-enrollment' })
});


Cypress.Commands.add('submitTestAnswer', (index: number) => {
    cy.get('input[type=radio]', { timeout: 5000 }).eq(index || 0).click({ force: true });
    cy.get('#save-and-next', { timeout: 30000 }).click()
});


// Cypress.Commands.add('initTest', (index: number) => {
//     await axios({ method: 'POST', url: 'user/test/create-test-learner' })
// });

// Cypress.Commands.add('enrollForPackage', async () => {
//     await cy.apiRequest({ method: 'POST', url: 'user/test/remove-package-enrollment' })
//     cy.visit('http://www.nimblebee.local:3000/test-series/test-package')
//     cy.get('#enroll-button').click({ force: true })
// });

Cypress.Commands.add('apiRequest', ({ method = 'GET', url, body = {}, headers = {} }) => {
    const apiUrl = Cypress.env('apiUrl');
    return axios({
        method,
        url: `${apiUrl}/${url}`,
        headers,
        body,
        failOnStatusCode: false, // Prevents Cypress from failing on non-2xx status codes
    })
});

//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }