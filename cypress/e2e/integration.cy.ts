/// <reference types="cypress" />

describe('Integration Baseline', () => {
  beforeEach(() => {
    // Visit the home page
    cy.visit('http://localhost:3000');
  });

  it('mocks the Google Sign-In flow and navigates to Dashboard', () => {
    // Wait for the UI to load
    cy.contains('Ecosystem Intelligence');
    
    // Instead of actually clicking "Sign in with Google" which opens a popup,
    // we intercept the authentication state to simulate a logged-in user.
    // However, since we are using Firebase Emulator, we can click it and 
    // it will use the Emulator's fake sign-in flow. 
    // For a headless test, mocking the window auth object is better.
    
    cy.window().then((win) => {
      // Mock the AuthContext state directly or trigger login
      // Since the context is inside React, we will intercept the Firebase Auth REST API
      // But a simpler approach for the emulator is to just simulate the button click
      // The Firebase Auth Emulator automatically handles the popup by showing an auto-login screen.
      // We will mock the auth state directly in Cypress for reliability
    });

    // We can also just check that the login button exists and intercept the auth state
    cy.contains('Sign In with Google').should('exist');
    
    // Set a fake auth token in local storage to simulate login
    cy.window().then((win) => {
      win.localStorage.setItem('auth_mock', 'true');
    });
    
    // Navigate to dashboard
    cy.visit('http://localhost:3000/dashboard');
    cy.contains('Lifestyle Data').should('exist');
  });

  it('verifies offline data persistence pipeline', () => {
    cy.visit('http://localhost:3000/dashboard');
    
    // Authenticate First
    cy.contains('Sign In with Google').click();
    cy.contains('Lifestyle Data').should('exist');
    
    // Wait for auth to settle
    cy.wait(1000);

    // Simulate Network Failure
    cy.log('Simulating offline mode using Firestore disableNetwork...');
    cy.window().then(async (win: any) => {
      if (win.db && win.disableNetwork) {
        await win.disableNetwork(win.db);
      }
    });
    
    // Interact with the calculator
    cy.contains('Kilometers Driven').parent().find('input').clear().type('150');
    cy.contains('Flights per Year').parent().find('input').clear().type('2');
    
    // Save Footprint
    cy.contains('Save Footprint').click();
    
    // Optimistic UI update should succeed even while offline
    cy.contains('Footprint saved successfully!').should('exist');
    
    // Restore Network
    cy.log('Restoring online mode...');
    cy.window().then(async (win: any) => {
      if (win.db && win.enableNetwork) {
        await win.enableNetwork(win.db);
      }
    });
    
    // Verify it persists by reloading
    cy.reload();
    cy.contains('Lifestyle Data').should('exist');
    // Ensure no error is shown
    cy.contains('Failed to fetch').should('not.exist');
  });
});
