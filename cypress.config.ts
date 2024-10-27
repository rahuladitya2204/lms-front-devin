import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.UI_URL, // Update this if your app runs on another port
    setupNodeEvents(on, config) {
      // Implement node event listeners if needed
    },
  },
  env: {
    contactNo: '7622950688',
    apiUrl: 'https://api.example.com',  // Example of additional environment variables
  }
});
