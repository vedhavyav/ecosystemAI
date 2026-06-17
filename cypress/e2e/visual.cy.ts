describe('Visual Regression Tests', () => {
  it('should match the homepage snapshot', () => {
    cy.visit('/');
    // Wait for animations and external assets
    cy.wait(2000); 
    // Take a snapshot of the whole page
    cy.matchImageSnapshot('homepage');
  });

  it('should match the community impact section snapshot', () => {
    cy.visit('/');
    cy.wait(2000);
    cy.contains('Community Impact').scrollIntoView();
    // Take a snapshot of a specific element
    cy.contains('Community Impact').parent().matchImageSnapshot('community-impact');
  });
});
