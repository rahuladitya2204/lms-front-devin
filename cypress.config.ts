import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.UI_URL, // Update this if your app runs on another port
    setupNodeEvents(on, config) {
      // Implement node event listeners if needed
    },
  },
  env: {
    NODE_ENV: 'test',
    contactNo: '9999999999',
    apiUrl: 'http://localhost:4000',  // Example of additional environment variables
  }
});
