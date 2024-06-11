Feature: storage

  Background:
    When I open '$storagePage' url

  Scenario: get cookie
    When I save value of 'fooCookie' cookie as 'cookie'
    And I expect '$cookie.value' to be equal 'barCookie'

  Scenario Outline: get <storage> storage
    When I save value of '<name>' <storage> storage as 'storageValue'
    And I expect '$storageValue' to be equal '<value>'

    Examples:
      | storage | name       | value      |
      | local   | fooLocal   | barLocal   |
      | session | fooSession | barSession |

  Scenario: set cookie
    When I set 'setCookie' cookie as 'setCookieValue'
    And I expect text of 'Cookie' to contain 'setCookie=setCookieValue'

  Scenario Outline: set <storage> storage
    When I set '<name>' <storage> storage value as 'set<storage>Value'
    And I expect text of '<element>' to contain '"<name>":"set<storage>Value"'

    Examples:
      | storage | name       | element        |
      | local   | setLocal   | LocalStorage   |
      | session | setSession | SessionStorage |