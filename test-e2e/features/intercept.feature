Feature: intercept

  Background:
    When I open '$mockPage' url

  Scenario: wait for passed through request
    When I create interception for '**/users.json' as 'fetchUsers'
    And I click 'Fetch Users'
    And I wait for result of '$fetchUsers' interception
    Then I expect '$fetchUsers.result.response.statusCode' to equal '200'
    And I expect '$fetchUsers.result.request.method' to equal 'GET'
    And I expect number of elements in 'Users' collection to equal '2'

  Scenario: interception with RouteMatcher from memory
    When I create interception for '$userInterceptionMatcher' as 'fetchUsers'
    And I click 'Fetch Users'
    And I wait for result of '$fetchUsers' interception and save it as 'call'
    Then I expect '$call.response.statusCode' to equal '200'
    And I expect '$call.response.body' to have type 'array'

  Scenario: wait for several calls one by one
    When I create interception for '**/users.json' as 'fetchUsers'
    And I click 'Fetch Users'
    And I wait for result of '$fetchUsers' interception
    And I click 'Fetch Users'
    And I wait for result of '$fetchUsers' interception
    Then I expect '$fetchUsers.calls.length' to equal '2'

  Scenario: mock response with docstring
    When I create mock for '**/users.json' as 'usersMock'
    And I set '$usersMock' mock to respond '200' with:
    """
    [
      { "name": "Mock 1" },
      { "name": "Mock 2" },
      { "name": "Mock 3" }
    ]
    """
    And I click 'Fetch Users'
    And I wait for result of '$usersMock' interception
    Then I expect number of elements in 'Users' collection to equal '3'
    And I expect text of 'Users' to contain '$userFromMemory'

  Scenario: mock response from memory
    When I create mock for '**/users.json' as 'usersMock'
    And I set '$usersMock' mock to respond '200' with '$users'
    And I click 'Fetch Users'
    Then I expect text of 'Users' to contain 'Memory Mock 3'

  Scenario: mock status without body
    When I create mock for '**/users.json' as 'usersMock'
    And I set '$usersMock' mock to respond '500'
    And I click 'Fetch Users'
    Then I expect text of 'Status' to equal '500'

  Scenario: mock network error
    When I create mock for '**/users.json' as 'usersMock'
    And I set '$usersMock' mock to abort
    And I click 'Fetch Users'
    Then I expect text of 'Status' to equal 'network error'

  Scenario: mocked request body is recorded
    When I create mock for '**/api/users' as 'saveUser'
    And I set '$saveUser' mock to respond '201' with:
    """
    { "id": 1 }
    """
    And I click 'Save User'
    And I wait for result of '$saveUser' interception and save it as 'call'
    Then I expect '$call.request.method' to equal 'POST'
    And I expect '$call.request.body.name' to equal 'John'
    And I expect '$call.response.statusCode' to equal '201'
    And I expect text of 'Status' to equal 'saved 201'

  Scenario: restore mock
    When I create mock for '**/users.json' as 'usersMock'
    And I set '$usersMock' mock to respond '200' with '$users'
    And I restore '$usersMock' mock
    And I click 'Fetch Users'
    Then I expect text of 'Users' to contain 'Real 1'

  Scenario: restore all mocks
    When I create mock for '**/users.json' as 'usersMock'
    And I set '$usersMock' mock to respond '500'
    And I restore all mocks
    And I click 'Fetch Users'
    Then I expect text of 'Status' to equal '200'

  Scenario: mocks do not leak to next scenario
    When I click 'Fetch Users'
    Then I expect text of 'Status' to equal '200'
    And I expect text of 'Users' to contain 'Real 1'
