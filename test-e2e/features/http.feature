Feature: http

  # Scenario: GraphQL send
  #   Given I create GraphQL request 'request'
  #   And I add 'https://rickandmortyapi.com/graphql' url to '$request'
  #   And I add query to GraphQL '$request':
  #   """
  #   query {  characters(page: 2, filter: { name: "rick" }) {
  #     results { name }
  #        }
  #     }
  #   """
  #   And I send '$request' request and save response as 'response'
  #   Then I expect '$response.status' to equal '200'

  Scenario: Verify simple send
    Given I create 'GET' request 'request'
    And I add 'https://jsonplaceholder.typicode.com/todos/1' url to '$request'
    And I send '$request' request and save response as 'response'
    Then I expect '$response.status' to equal '200'
    Then I expect '$response.statusText' to equal 'OK'
    Then I expect '$response.body.userId' to equal '$js(1)'
    Then I expect '$response.body.id' to equal '$js(1)'
    Then I expect '$response.body.title' to equal 'delectus aut autem'
    Then I expect '$response.body.completed' to equal '$js(false)'

  Scenario: Verify POST with valid request body as Cucumber Doc String
    Given I create 'POST' request 'request'
    And I add 'https://jsonplaceholder.typicode.com/posts' url to '$request'
    And I add headers to '$request':
      | Content-Type | application/json |
    And I add body to '$request':
    """
      {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
      }
    """
    And I send '$request' request and save response as 'response'
    Then I expect '$response.status' to equal '201'
    Then I expect '$response.statusText' to equal 'Created'
    Then I expect '$response.body.title' to equal 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
    Then I expect '$response.body.userId' to equal '$js(1)'

  Scenario: Non-2xx response is saved without failing the step
    Given I create 'GET' request 'request'
    And I add 'https://jsonplaceholder.typicode.com/todos/0' url to '$request'
    And I send '$request' request and save response as 'response'
    Then I expect '$response.status' to equal '404'

  Scenario: Verify POST with request body from memory
    Given I create 'POST' request 'request'
    And I add 'https://jsonplaceholder.typicode.com/posts' url to '$request'
    And I add '$js({ title: "qavajs" })' body to '$request'
    And I send '$request' request and save response as 'response'
    Then I expect '$response.status' to equal '201'
    Then I expect '$response.body.title' to equal 'qavajs'
