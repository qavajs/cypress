Feature: memory isolation

  Scenario: value is saved in first scenario
    When I save 'first' to memory as 'scenarioValue'
    Then I expect '$scenarioValue' to equal 'first'

  Scenario: value saved by previous scenario is not available
    Then I expect '$js(typeof $scenarioValue)' to equal 'undefined'
    And I expect '$userFromMemory' to equal 'Mock 3'

  Scenario: registered value overridden by previous scenario is restored
    When I set 'userFromMemory' = 'changed'
    Then I expect '$userFromMemory' to equal 'changed'

  Scenario: registered value is not changed by previous scenario
    Then I expect '$userFromMemory' to equal 'Mock 3'

  Scenario Outline: example rows with the same title do not share memory
    Then I expect '$js(typeof $outlineValue)' to equal 'undefined'
    When I save '<value>' to memory as 'outlineValue'

    Examples:
      | value |
      | one   |
      | two   |
