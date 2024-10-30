// import '@cypress/code-coverage/support';
// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import axios from 'axios';
import './commands'
import { axiosTestInstance } from './commands';


// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('uncaught:exception', (err) => {
    return false
});

before(async () => {
    try {
        await axiosTestInstance({ method: 'POST', url: 'user/test/create-test-learner' })
        await axiosTestInstance({ method: 'POST', url: 'user/test/create-test-package' })
    }
    catch (er) {
        console.log(er, 'rrr')
    }
})
