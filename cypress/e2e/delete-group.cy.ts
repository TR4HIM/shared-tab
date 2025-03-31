describe('Delete Group', () => {
  beforeEach(() => {
    // Mock the API response for the group to delete
    cy.intercept('GET', '/api/groups/123', {
      statusCode: 200,
      fixture: 'group-detail.json',
    }).as('getGroup');

    // Visit the group page
    cy.visit('/groups/123');
    cy.get('[data-test-id="group-tabs-list"]').find('button:eq(2)').click();
    cy.wait('@getGroup');
  });

  it('shows the delete confirmation dialog when delete button is clicked', () => {
    // Click the delete button
    cy.get('[data-test-id="delete-group-button"]').click();

    // Verify the confirmation dialog appears
    cy.get('[role="alertdialog"]').should('be.visible');
    cy.get('[role="alertdialog"]')
      .contains('Are you absolutely sure?')
      .should('be.visible');
    cy.contains('button', 'Cancel').should('be.visible');
    cy.contains('button', 'Delete').should('be.visible');
  });

  it('closes the delete confirmation dialog when cancel is clicked', () => {
    // Open the delete confirmation dialog
    cy.get('[data-test-id="delete-group-button"]').click();
    cy.get('[role="alertdialog"]').should('be.visible');

    // Click the cancel button
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains('button', 'Cancel').click();
    });

    // Verify the dialog is closed
    cy.get('[role="alertdialog"]').should('not.exist');

    // Should remain on the group page
    cy.url().should('include', '/groups/123');
  });

  it('successfully deletes a group and redirects to groups list', () => {
    // Mock the API response for deleting the group
    cy.intercept('DELETE', '/api/groups/123', {
      statusCode: 200,
      body: {
        success: true,
        data: null,
      },
    }).as('deleteGroup');

    // Open the delete confirmation dialog
    cy.get('[data-test-id="delete-group-button"]').click();
    cy.get('[role="alertdialog"]').should('be.visible');

    // Confirm deletion
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains('button', 'Delete').click();
    });

    // Wait for the API call to be made
    cy.wait('@deleteGroup');

    // Should redirect to the groups list page
    cy.url().should('include', '/groups');
    cy.url().should('not.include', '/123');

    // Verify localStorage is updated (group ID is removed)
    cy.window().then((win) => {
      const storedGroups = JSON.parse(
        win.localStorage.getItem('userGroups') || '[]'
      );
      expect(storedGroups).to.not.include('123');
    });
  });

  it('shows loading state while deleting a group', () => {
    // Mock the API response with a delay
    cy.intercept('DELETE', '/api/groups/123', {
      statusCode: 200,
      delay: 500,
      body: {
        success: true,
        data: null,
      },
    }).as('deleteGroup');

    // Open the delete confirmation dialog and confirm deletion
    cy.get('[data-test-id="delete-group-button"]').click();
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains('button', 'Delete').click();
    });

    // Check for loading state
    cy.get('svg.animate-spin').should('be.visible');

    // Wait for the API call to complete
    cy.wait('@deleteGroup');

    // Should redirect after success
    cy.url().should('include', '/groups');
    cy.url().should('not.include', '/123');
  });

  it('handles error response from the server when trying to delete', () => {
    // Mock an error response from the API
    cy.intercept('DELETE', '/api/groups/123', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Server error occurred',
      },
    }).as('deleteGroupError');

    // Open the delete confirmation dialog and confirm deletion
    cy.get('[data-test-id="delete-group-button"]').click();
    cy.get('[role="alertdialog"]').within(() => {
      cy.contains('button', 'Delete').click();
    });

    // Wait for the error response
    cy.wait('@deleteGroupError');

    // Should stay on the same page after error (not redirect)
    cy.url().should('include', '/groups/123');

    // Should show error notification
    cy.contains('An unknown error occurred').should('be.visible');

    // Verify the dialog is closed even on error
    cy.get('[role="alertdialog"]').should('not.exist');
  });
});
