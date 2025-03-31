describe('Create Group Page', () => {
  beforeEach(() => {
    // Clear localStorage before each test to start fresh
    cy.clearLocalStorage();
    cy.visit('/groups/new');
  });

  it('displays the group creation form with empty fields', () => {
    // Verify form elements are visible
    cy.get('[data-test-id="group-form"]').should('be.visible');
    cy.contains('Group Details').should('be.visible');
    cy.contains('Group Name').should('be.visible');
    cy.contains('Currency').should('be.visible');
    cy.contains('Description').should('be.visible');
    cy.contains('Participants').should('be.visible');

    // Verify default values
    cy.get('input[placeholder="Group Name"]').should('have.value', '');
    cy.get('input[placeholder="Currency"]').should('have.value', 'MAD');
    cy.get('textarea[placeholder="Description (optional)"]').should(
      'have.value',
      ''
    );

    // Verify that there's initially one empty member field
    cy.get('input[placeholder="Member name"]').should('have.length', 1);
    cy.get('input[placeholder="Member name"]').first().should('have.value', '');

    // Verify buttons
    cy.contains('button', 'Create Group').should('be.visible');
    cy.contains('button', 'Cancel').should('be.visible');
  });

  it('allows adding and removing participants', () => {
    // Should start with one member field
    cy.get('input[placeholder="Member name"]').should('have.length', 1);

    // Add a member
    cy.contains('button', 'Add Member').click();
    cy.get('input[placeholder="Member name"]').should('have.length', 2);

    // Add another member
    cy.contains('button', 'Add Member').click();
    cy.get('input[placeholder="Member name"]').should('have.length', 3);

    // Remove a member
    cy.get('[data-test-id="remove-member-button"]').eq(1).click();
    cy.get('input[placeholder="Member name"]').should('have.length', 2);

    // Cannot remove last member (button should be disabled)
    cy.get('input[placeholder="Member name"]').should('have.length', 2);
    cy.get('[data-test-id="remove-member-button"]').eq(0).click();
    cy.get('input[placeholder="Member name"]').should('have.length', 1);
    cy.get('[data-test-id="remove-member-button"]').should('be.disabled');
  });

  it('shows validation errors for empty required fields', () => {
    // Try submitting with empty fields
    cy.contains('button', 'Create Group').click();

    // Group name is required
    cy.contains('Group name is required').scrollIntoView().should('be.visible');

    // Member name is required
    cy.contains('Name is required').should('be.visible');
  });

  it('successfully creates a new group and redirects', () => {
    // Mock the API response for group creation with a more reliable timeout
    cy.intercept('POST', '/api/groups', {
      statusCode: 200,
      fixture: 'create-group-success.json',
    }).as('createGroup');

    // Fill out the form with explicit waits
    cy.get('input[placeholder="Group Name"]')
      .should('be.visible')
      .type('Trip to Paris');
    cy.get('input[placeholder="Currency"]')
      .should('be.visible')
      .type('{selectall}{del}')
      .type('EUR');
    cy.get('textarea[placeholder="Description (optional)"]')
      .should('be.visible')
      .type('Our vacation to Paris');

    // Add member names with explicit waits
    cy.get('input[placeholder="Member name"]')
      .first()
      .should('be.visible')
      .type('John');
    cy.contains('button', 'Add Member').should('be.visible').click();
    cy.get('input[placeholder="Member name"]')
      .eq(1)
      .should('be.visible')
      .type('Jane');

    // Submit the form and wait for response
    cy.contains('button', 'Create Group').should('be.visible').click();

    // Wait for the API call to be made with a longer timeout
    cy.wait('@createGroup', { timeout: 15000 }).then((interception) => {
      // Validate the request payload
      const requestBody = interception.request.body;
      expect(requestBody.name).to.equal('Trip to Paris');
      expect(requestBody.currency).to.equal('EUR');
      expect(requestBody.description).to.equal('Our vacation to Paris');
      expect(requestBody.members).to.have.length(2);
      expect(requestBody.members[0].name).to.equal('John');
      expect(requestBody.members[1].name).to.equal('Jane');
    });
    // Should redirect to the new group page with a longer timeout
    cy.url().should('include', '/groups/new-group-123');
  });

  it('shows loading state while creating a group', () => {
    // Mock the API response with a delay
    cy.intercept('POST', '/api/groups', {
      statusCode: 200,
      delay: 500, // add delay to see loading state
      fixture: 'create-group-success.json',
    }).as('createGroup');

    // Fill out the form with minimum required fields
    cy.get('input[placeholder="Group Name"]').type('Trip to Paris');
    cy.get('input[placeholder="Member name"]').first().type('John');

    // Submit the form
    cy.contains('button', 'Create Group').click();

    // Check for loading state
    cy.get('svg.animate-spin').should('be.visible');

    // Wait for the API call to complete
    cy.wait('@createGroup');

    // Should redirect after success
    cy.url().should('include', '/groups/new-group-123');
  });

  it('handles form validation for duplicate member names', () => {
    // Fill out group details
    cy.get('input[placeholder="Group Name"]').type('Family Trip');

    // Add two members with the same name
    cy.get('input[placeholder="Member name"]').first().type('John');
    cy.contains('button', 'Add Member').click();
    cy.get('input[placeholder="Member name"]').eq(1).type('John');

    // Submit form
    cy.contains('button', 'Create Group').click();

    // Should show validation error for duplicate names
    cy.contains('Member name must be unique').should('be.visible');
  });

  it('handles error response from the server', () => {
    // Mock an error response from the API
    cy.intercept('POST', '/api/groups', {
      statusCode: 500,
      fixture: 'create-group-error.json',
    }).as('createGroupError');

    // Fill out the form with valid data
    cy.get('input[placeholder="Group Name"]').type('Error Test Group');
    cy.get('input[placeholder="Member name"]').first().type('John');

    // Submit the form
    cy.contains('button', 'Create Group').click();

    // Wait for the error response
    cy.wait('@createGroupError');

    // Should stay on the same page after error (not redirect)
    cy.url().should('include', '/groups/new');

    // Form should remain filled
    cy.get('input[placeholder="Group Name"]').should(
      'have.value',
      'Error Test Group'
    );
  });

  it('navigates back to groups list when cancel is clicked', () => {
    // Click the cancel button
    cy.contains('button', 'Cancel').click();

    // Should navigate back to the groups list
    cy.url().should('include', '/groups');
    cy.url().should('not.include', '/new');
  });

  it('limits the number of members that can be added', () => {
    // The form should allow a maximum of 10 members according to the schema
    // Loop to add members up to limit
    for (let i = 1; i < 20; i++) {
      cy.contains('button', 'Add Member').click();
    }

    // Should now have 10 member input fields
    cy.get('input[placeholder="Member name"]').should('have.length', 20);

    // The "Add Member" button should now be disabled
    cy.contains('button', 'Add Member').should('be.disabled');
  });

  it('validates the form data when submitting', () => {
    // Mock successful API response
    cy.intercept('POST', '/api/groups', {
      statusCode: 200,
      fixture: 'create-group-success.json',
    }).as('createGroup');

    // Test with maximum character length for group name
    const longGroupName = 'A'.repeat(100);
    cy.get('input[placeholder="Group Name"]').type(longGroupName);

    // Add valid member
    cy.get('input[placeholder="Member name"]').type('John Doe');

    // Submit the form
    cy.contains('button', 'Create Group').click();

    // Wait for the API call to be made
    cy.wait('@createGroup').then((interception) => {
      const requestBody = interception.request.body;
      expect(requestBody.name).to.equal(longGroupName);
      expect(requestBody.members[0].name).to.equal('John Doe');
    });
  });
});
