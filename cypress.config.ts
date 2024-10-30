import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'wqyupj',
  e2e: {
    baseUrl: process.env.UI_URL, // Update this if your app runs on another port
    setupNodeEvents(on, config) {
      // Implement node event listeners if needed
    },
  },
  env: {
    NODE_ENV: 'test',
    contactNo: '9999999999',
    apiUrl: process.env.NEXT_PUBLIC_API_URL,  // Example of additional environment variables
    appUrl: 'http://www.nimblebee.local:3000'
  }
});
