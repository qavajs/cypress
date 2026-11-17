Feature: mouse actions

  Background:
    When I open '$actionsPage' url
    And I hover over 'Event Handler'

  Scenario Outline: mouse press and release
    Then I press <name> mouse button on '20, 500'
    And I expect text of 'Event Handler' to contain '"buttons":<buttonCode>'
    And I expect text of 'Event Handler' to contain '"type":"mousedown"'
    And I expect text of 'Event Handler' to contain '"button":<button>'
    Then I release <name> mouse button on '20, 500'
    And I expect text of 'Event Handler' to contain '"type":"mouseup"'
    And I expect text of 'Event Handler' to contain '"button":<button>'
    And I expect text of 'Event Handler' to contain '"buttons":0'

    Examples:
      | name   | button | buttonCode |
      | left   | 0      | 1          |
      | right  | 2      | 2          |
      | middle | 1      | 4          |

  Scenario: mouse move
    Then I move mouse to '10, 10'
    And I expect text of 'Event Handler' to contain '"type":"mousemove"'

  Scenario Outline: mouse wheel
    Then I scroll mouse wheel by '<offset>' on '20, 500'
    And I expect text of 'Event Handler' to contain '"type":"wheel"'
    And I expect text of 'Event Handler' to match '<deltaY>'

    Examples:
      | offset  | deltaY            |
      | 0, 100  | .+"deltaY":\d+.+  |
      | 0, -100 | .+"deltaY":-\d+.+ |
