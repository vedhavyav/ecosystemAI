describe('Footprint Calculator Flow', () => {
  it('should allow user to navigate to dashboard and use calculator', () => {
    // Visit the home page
    cy.visit('/');
    
    // Check if hero section is present
    cy.contains('Ecosystem Intelligence').should('be.visible');
    
    // Simulate navigation to dashboard
    cy.contains('Calculate Footprint').click();
    
    // Wait for route transition
    cy.url().should('include', '/dashboard');
    
    // In Dashboard, Calculator3D should be visible
    cy.contains('Lifestyle Data').should('be.visible');
    
    // Update transport inputs
    cy.get('input[type="number"]').first().clear().type('200');
    
    // Switch to energy tab
    cy.contains('Energy').click();
    cy.contains('Electricity').should('be.visible');
    
    // Should display score based on inputs
    cy.contains('Your Eco Score').should('be.visible');
  });
});
