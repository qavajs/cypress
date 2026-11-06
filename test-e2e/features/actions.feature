Feature: actions

  Background:
    When I open '$actionsPage' url

  Scenario: click
    When I click 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: force click
    When I force click 'Button'
    Then I expect text of 'Action' to be equal 'click'

  Scenario: right click
    When I right click 'Button'
    Then I expect text of 'Action' to be equal 'rightclick'

  Scenario: double click
    When I double click 'Button'
    Then I expect text of 'Action' to be equal 'dblclick'

  Scenario Outline: type (<word>)
    When I type 'test value' <word> 'Input'
    Then I expect text of 'Action' to be equal 'test value'

    Examples:
      | word |
      | to   |
      | into |

  Scenario: clear
    When I type 'test value' to 'Input'
    When I clear 'Input'
    Then I expect 'value' property of 'Input' to be equal ''

  Scenario Outline: click in collection by text (<value>)
    When I click '<value>' text in 'Buttons' collection
    Then I expect text of 'Action' to be equal 'Button2'

    Examples:
      | value    |
      | Button2  |
      | $button2 |

  Scenario: refresh page
    When I type 'test value' to 'Input'
    Then I expect text of 'Action' to be equal 'test value'
    When I refresh page
    Then I expect text of 'Action' to be equal 'Nothing'

  Scenario: press key
    When I press 'w' key
    Then I expect text of 'Action' to be equal 'keypress'

  Scenario: press key with modifier
    And I press '{alt}a' key
    Then I expect text of 'Key Dump' to contain '"keyCode":65'
    Then I expect text of 'Key Dump' to contain '"altKey":true'

  Scenario Outline: press <Key> key multiple times
    When I press '<Key>' key <Times> time<Postfix>
    Then I expect text of 'Press Counter' to be equal '<Result>'

    Examples:
      | Key     | Times | Postfix | Result                |
      | {enter} | 1     |         | pressed Enter 1 times |

  Scenario: hover
    When I hover over 'Button Hover'
    Then I expect text of 'Action' to be equal 'hover'

  Scenario: select input by text
    When I select 'two' option from 'Select' dropdown
    Then I expect text of 'Action' to be equal 'select two'

  Scenario: select input by index
    When I select 2 option from 'Select' dropdown
    Then I expect text of 'Action' to be equal 'select two'

  Scenario: scroll in window
    When I scroll by '0, 100'
    And I execute 'this.scrollX' function and save result as 'scrollX'
    And I execute 'this.scrollY' function and save result as 'scrollY'
    Then I expect '$scrollX' to be equal '$js(0)'
    Then I expect '$scrollY' to be equal '$js(100)'

  Scenario: scroll in element
    When I scroll by '0, 50' in 'Overflow Container'
    And I execute 'this.document.querySelector("#overflowContainer").scrollLeft' function and save result as 'scrollX'
    And I execute 'this.document.querySelector("#overflowContainer").scrollTop' function and save result as 'scrollY'
    Then I expect '$scrollX' to be equal '$js(0)'
    Then I expect '$scrollY' to be equal '$js(50)'

  Scenario: upload file
    When I upload '$uploadFile' file to 'File Input'
    Then I expect text of 'Action' to be equal 'file:C:\fakepath\actions.html'

  Scenario: accept alert
    And I will accept alert
    When I click 'Alert Button'
    Then I expect text of 'Action' to be equal 'true'

  Scenario: dismiss alert
    And I will dismiss alert
    When I click 'Alert Button'
    Then I expect text of 'Action' to be equal 'false'

  Scenario: type text to alert
    When I expect text of 'Action' to be equal 'Nothing'
    And I will type 'I am not a robot' to alert
    And I click 'Prompt Button'
    Then I expect text of 'Action' to be equal 'I am not a robot'

  Scenario: expect text of alert
    When I click 'Alert Button'
    Then I expect text of alert to be equal 'Are you robot?'

  Scenario: type value saved in previous step
    When I save text of 'Button' as 'buttonText'
    And I type '$buttonText' to 'Input'
    Then I expect text of 'Action' to be equal 'Click Me!'

  Scenario: type into re-rendered element
    When I execute '(() => { const i = this.document.querySelector("#input"); i.disabled = true; setTimeout(() => { const n = i.cloneNode(); n.disabled = false; i.replaceWith(n); }, 500); })()' function
    And I type 'abc' to 'Input'
    Then I expect 'value' property of 'Input' to be equal 'abc'

  Scenario: reload page
    When I type 'test value' to 'Input'
    When I reload page
    Then I expect text of 'Action' to be equal 'Nothing'

  Scenario: clear and type
    When I type 'old value' to 'Input'
    When I clear 'Input' and type 'new value'
    Then I expect 'value' property of 'Input' to be equal 'new value'

  Scenario: go back and forward
    When I open '$valuesPage' url
    And I go back
    Then I expect current url to contain 'actions.html'
    When I go forward
    Then I expect current url to contain 'values.html'

  Scenario: check and uncheck checkbox
    When I check 'Checkbox'
    Then I expect 'checked' property of 'Checkbox' to be equal '$js(true)'
    When I uncheck 'Checkbox'
    Then I expect 'checked' property of 'Checkbox' to be equal '$js(false)'

  Scenario: check radio button
    When I check 'Radio Two'
    Then I expect 'checked' property of 'Radio Two' to be equal '$js(true)'
    And I expect 'checked' property of 'Radio One' to be equal '$js(false)'
    When I check 'Radio One'
    Then I expect 'checked' property of 'Radio Two' to be equal '$js(false)'

  Scenario: numeric validation of element text
    Then I expect text of 'Counter' to be above '41'
    And I expect text of 'Counter' to be below '43'

  Scenario: hidden condition
    Then I expect 'Hidden Text' to be hidden
    And I expect 'Button' not to be hidden
