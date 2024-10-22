import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://www.nimblebee.local:3000', // Update this if your app runs on another port
    setupNodeEvents(on, config) {
      // Implement node event listeners if needed
    },
  },
});
