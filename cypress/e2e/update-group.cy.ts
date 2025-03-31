describe('Update Group Page', () => {
  beforeEach(() => {
    // Clear localStorage before each test to start fresh
    // Mock the API response for the group to update
    cy.intercept('GET', '/api/groups/123', {
      statusCode: 200,
      fixture: 'group-detail.json',
    }).as('getGroup');

    // Visit the edit page
    cy.visit('/groups/123');
    cy.get('[data-test-id="group-tabs-list"]').find('button:eq(2)').click();
    cy.wait('@getGroup');
  });

  it('displays the group edit form with pre-filled fields', () => {
    // Verify form elements are visible with pre-populated data
    cy.get('[data-test-id="group-form"]').should('be.visible');
    cy.get('input[placeholder="Group Name"]').should(
      'have.value',
      'Trip to Paris'
    );
    cy.get('input[placeholder="Currency"]').should('have.value', 'MAD');
    cy.get('textarea[placeholder="Description (optional)"]').should(
      'have.value',
      'Our vacation to Paris'
    );

    // Verify existing members are displayed
    cy.get('input[placeholder="Member name"]').should(
      'have.length.at.least',
      2
    );
    cy.get('input[placeholder="Member name"]')
      .eq(0)
      .should('have.value', 'John');
    cy.get('input[placeholder="Member name"]')
      .eq(1)
      .should('have.value', 'Jane');

    // Verify buttons
    cy.contains('button', 'Update Group').should('be.visible');
    cy.contains('button', 'Cancel').should('be.visible');
  });

  it('allows editing group details', () => {
    // Mock the API response for updating the group
    cy.intercept('PATCH', '/api/groups/123', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '123',
          name: 'Trip to Rome',
          description: 'Our vacation to Rome',
          currency: 'EUR',
          members: [
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' },
            { id: '3', name: 'Alice' },
          ],
        },
      },
    }).as('updateGroup');

    // Change group details
    cy.get('input[placeholder="Group Name"]')
      .type('{selectall}{del}')
      .type('Trip to Rome');
    cy.get('textarea[placeholder="Description (optional)"]')
      .type('{selectall}{del}')
      .type('Our vacation to Rome');

    // Add a new member
    cy.contains('button', 'Add Member').click();
    cy.get('input[placeholder="Member name"]').eq(2).type('Alice');

    // Submit the form
    cy.contains('button', 'Update Group').click();

    // Wait for the API call to be made
    cy.wait('@updateGroup').then((interception) => {
      // Validate the request payload
      const requestBody = interception.request.body;
      expect(requestBody.name).to.equal('Trip to Rome');
      expect(requestBody.description).to.equal('Our vacation to Rome');
      expect(requestBody.members).to.have.length(3);
      expect(requestBody.members[2].name).to.equal('Alice');
    });

    // Should redirect to the group page after update
    cy.url().should('include', '/groups/123');
  });

  it('shows validation errors for empty required fields', () => {
    // Clear required fields
    cy.get('input[placeholder="Group Name"]').type('{selectall}{del}');
    cy.get('input[placeholder="Member name"]').first().type('{selectall}{del}');

    // Submit form
    cy.contains('button', 'Update Group').click();

    // Should show validation errors
    cy.contains('Group name is required').should('be.visible');
  });

  it('allows removing existing members', () => {
    // Mock the API response for updating the group
    cy.intercept('PATCH', '/api/groups/123', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: '123',
          name: 'Trip to Paris',
          description: 'Our vacation to Paris',
          currency: 'EUR',
          members: [{ id: '1', name: 'John' }],
        },
      },
    }).as('updateGroup');

    // Remove a member (Jane)
    cy.get('[data-test-id="remove-member-button"]').eq(1).click();

    // Submit the form
    cy.contains('button', 'Update Group').click();

    // Wait for the API call
    cy.wait('@updateGroup').then((interception) => {
      // Validate the request payload - should only have one member now
      const requestBody = interception.request.body;
      expect(requestBody.members).to.have.length(1);
      expect(requestBody.members[0].name).to.equal('John');
    });
  });

  it('shows loading state while updating a group', () => {
    // Mock the API response with a delay
    cy.intercept('PATCH', '/api/groups/123', {
      statusCode: 200,
      delay: 500,
      body: {
        success: true,
        data: {
          id: '123',
          name: 'Trip to Paris',
          description: 'Our vacation to Paris',
          currency: 'EUR',
          members: [
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' },
          ],
        },
      },
    }).as('updateGroup');

    // Make a small change and submit
    cy.get('input[placeholder="Group Name"]')
      .type('{selectall}{del}')
      .type('Updated Trip Name');
    cy.contains('button', 'Update Group').click();

    // Check for loading state
    cy.get('svg.animate-spin').should('be.visible');

    // Wait for the API call to complete
    cy.wait('@updateGroup');

    // Should redirect after success
    cy.url().should('include', '/groups/123');
  });

  it('handles error response from the server', () => {
    // Mock an error response from the API
    cy.intercept('PATCH', '/api/groups/123', {
      statusCode: 500,
      body: {
        success: false,
        error: 'Server error occurred',
      },
    }).as('updateGroupError');

    // Make a change and submit
    cy.get('input[placeholder="Group Name"]')
      .type('{selectall}{del}')
      .type('Error Test');
    cy.contains('button', 'Update Group').click();

    // Wait for the error response
    cy.wait('@updateGroupError');

    // Should stay on the same page after error (not redirect)
    cy.url().should('include', '/groups/123');

    // Form should remain filled
    cy.get('input[placeholder="Group Name"]').should(
      'have.value',
      'Error Test'
    );

    // Should show error notification
    cy.contains('An unknown error occurred').should('be.visible');
  });

  it('navigates back to group details when cancel is clicked', () => {
    // Click the cancel button
    cy.contains('button', 'Cancel').click();

    // Should navigate back to the group details page
    cy.url().should('include', '/groups/123');
  });

  it('handles validation for duplicate member names', () => {
    // Try to add a duplicate member name
    cy.contains('button', 'Add Member').click();
    cy.get('input[placeholder="Member name"]').eq(2).type('John');

    // Submit form
    cy.contains('button', 'Update Group').click();

    // Should show validation error for duplicate names
    cy.contains('Member name must be unique').should('be.visible');
  });
});
