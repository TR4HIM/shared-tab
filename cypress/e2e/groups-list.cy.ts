describe('Groups List Page', () => {
  beforeEach(() => {
    // Clear localStorage before each test to start fresh
    cy.clearLocalStorage();
  });

  it('displays loading spinner while fetching groups', () => {
    // Setup localStorage with userGroupIds that match the fixture
    cy.window().then((win) => {
      win.localStorage.setItem('userGroups', JSON.stringify(['1', '2']));
    });

    // Mock the API response with a delay to ensure we can see the loading state
    cy.intercept('GET', '/api/groups', {
      delay: 500, // Add delay to ensure loading state is visible
      fixture: 'groups.json',
    }).as('getGroups');

    cy.visit('/groups');
    cy.get('svg.animate-spin').should('be.visible');
    cy.wait('@getGroups');
  });

  it('shows empty state when no groups exist', () => {
    // Setup localStorage with userGroupIds
    cy.window().then((win) => {
      win.localStorage.setItem('userGroups', JSON.stringify([]));
    });

    // Mock empty API response
    cy.intercept('GET', '/api/groups', {
      body: {
        success: true,
        data: [],
      },
    }).as('getEmptyGroups');

    cy.visit('/groups');
    cy.wait('@getEmptyGroups');

    cy.get('[data-test-id="no-groups-card"]').should('be.visible');
    cy.contains('No groups found').should('be.visible');
    cy.contains('Create your first group').should('be.visible');
    cy.get('[data-test-id="no-groups-card"] button')
      .contains('Create Group')
      .should('be.visible');
  });

  it('displays groups when they exist', () => {
    // Setup localStorage with userGroupIds that match the mock data
    cy.window().then((win) => {
      win.localStorage.setItem('userGroups', JSON.stringify(['1', '2']));
    });

    const mockGroups = [
      {
        id: '1',
        name: 'Test Group 1',
        description: 'This is test group 1',
        currency: 'MAD',
        members: [
          { id: '1', name: 'Member 1' },
          { id: '2', name: 'Member 2' },
        ],
      },
      {
        id: '2',
        name: 'Test Group 2',
        description: null,
        currency: 'MAD',
        members: [{ id: '3', name: 'Member 3' }],
      },
    ];

    // Mock the API response with success data
    cy.intercept('GET', '/api/groups', {
      body: {
        success: true,
        data: mockGroups,
      },
    }).as('getGroups');

    // Visit the page after setting up the intercept
    cy.visit('/groups');
    cy.wait('@getGroups');

    // Verify the groups are displayed
    cy.get('[data-test-id="groups-list"]').should('be.visible');
    cy.get('[data-test-id="group-card-1"]').should('be.visible');
    cy.get('[data-test-id="group-card-2"]').should('be.visible');

    // Check first group details
    cy.get('[data-test-id="group-card-1"]').within(() => {
      cy.contains('Test Group 1').should('be.visible');
      cy.contains('This is test group 1').should('be.visible');
      cy.contains('2 members').should('be.visible');
    });

    // Check second group with null description shows "No description"
    cy.get('[data-test-id="group-card-2"]').within(() => {
      cy.contains('Test Group 2').should('be.visible');
      cy.contains('No description').should('be.visible');
      cy.contains('1 members').should('be.visible');
    });
  });

  it('navigates to group details page when a group card is clicked', () => {
    // Setup localStorage with userGroupIds
    cy.window().then((win) => {
      win.localStorage.setItem('userGroups', JSON.stringify(['1']));
    });

    const mockGroups = [
      {
        id: '1',
        name: 'Test Group 1',
        description: 'This is test group 1',
        currency: 'MAD',
        members: [{ id: '1', name: 'Member 1' }],
      },
    ];

    // Mock the API response
    cy.intercept('GET', '/api/groups', {
      body: {
        success: true,
        data: mockGroups,
      },
    }).as('getGroups');

    cy.visit('/groups');
    cy.wait('@getGroups');

    cy.get('[data-test-id="group-card-1"]').click();
    cy.url().should('include', '/groups/1');
  });

  it('navigates to create group page when "New Group" button is clicked', () => {
    // Set up localStorage with some groups to ensure the New Group button is visible
    cy.window().then((win) => {
      win.localStorage.setItem('userGroups', JSON.stringify(['1']));
    });

    // Mock with one group to make sure the button is visible (not empty state)
    cy.intercept('GET', '/api/groups', {
      body: {
        success: true,
        data: [
          {
            id: '1',
            name: 'Test Group',
            description: 'Test description',
            currency: 'MAD',
            members: [],
          },
        ],
      },
    }).as('getGroups');

    cy.visit('/groups');
    cy.wait('@getGroups');

    cy.get('[data-test-id="new-group-button"]').click();
    cy.url().should('include', '/groups/new');
  });

  it('navigates to create group page from empty state button', () => {
    // Setup empty localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('userGroups', JSON.stringify([]));
    });

    // Mock with empty groups to show empty state
    cy.intercept('GET', '/api/groups', {
      body: {
        success: true,
        data: [],
      },
    }).as('getEmptyGroups');

    cy.visit('/groups');
    cy.wait('@getEmptyGroups');

    cy.get('[data-test-id="no-groups-card"] button')
      .contains('Create Group')
      .click();
    cy.url().should('include', '/groups/new');
  });
});
