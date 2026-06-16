import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  env: {
    NEXT_PUBLIC_USE_FIREBASE_EMULATOR: 'true'
  }
})
