# @qavajs/cypress

Gherkin/BDD step definitions for web testing with Cypress. Part of the [qavajs](https://github.com/qavajs) framework.

## Installation

```bash
npm install @qavajs/cypress @qavajs/cypress-runner-adapter @qavajs/memory
```

## Configuration

**cypress.config.js**
```javascript
const { defineConfig } = require('cypress');
const cucumber = require('@qavajs/cypress-runner-adapter/adapter');

module.exports = defineConfig({
    e2e: {
        specPattern: 'cypress/features/**/*.feature',
        supportFile: 'cypress/support/e2e.js',
        setupNodeEvents(on, config) {
            on('file:preprocessor', cucumber);
        },
    },
});
```

**cypress/support/e2e.js**
```typescript
import defineQavajs from '@qavajs/cypress/defineQavajs';
import '@qavajs/cypress';

import PageObject from '../page_object';
import Memory from '../memory';

defineQavajs({
    pageObject: new PageObject(),
    memory: new Memory()
});
```

## Page Objects

Page objects define element locators used in step definitions.

```typescript
import { locator } from '@qavajs/cypress/po';

class Header {
    Logo = locator('.logo');
    Nav  = locator('nav');
}

export default class App {
    // Simple CSS/XPath selector
    SearchInput  = locator('#search');
    SearchButton = locator('#searchBtn');
    Results      = locator('.result-item');

    // Parameterized selector
    ResultByIndex = locator.template(idx => `.result-item:nth-child(${idx})`);

    // Custom Cypress query
    ActiveTab = locator.native(({ cy }) => cy.get('.tab').filter('.active'));

    // Nested component
    Header = locator('header').as(Header);
}
```

Elements are referenced in steps by their property name (e.g. `'Search Input'` or `'Header > Logo'` for nested components).

## Memory

The memory class stores values accessible in steps via the `$key` syntax.

```typescript
export default class Memory {
    baseUrl      = 'https://example.com';
    testUser     = 'user@example.com';
    // Functions are called on access
    timestamp    = () => Date.now();
    uppercase    = (str: string) => str.toUpperCase();
}
```

Use `$key` in any step parameter to reference a memory value, `$key()` to call a function, and `$key.property` for nested access.

---

## Step Definitions

### Navigation & Actions

| Step | Description |
|------|-------------|
| `I open '{value}' url` | Navigate to a URL |
| `I reload page` | Reload current page |
| `I go back` | Browser back |
| `I go forward` | Browser forward |
| `I click '{locator}'` | Click an element |
| `I force click '{locator}'` | Force-click (bypasses actionability checks) |
| `I double click '{locator}'` | Double-click |
| `I right click '{locator}'` | Right-click |
| `I type '{value}' to '{locator}'` | Type text into an element |
| `I type '{value}' into '{locator}'` | Alias for type |
| `I clear '{locator}'` | Clear an input |
| `I clear '{locator}' and type '{value}'` | Clear then type |
| `I press '{value}' key` | Press a keyboard key or combo (e.g. `Enter`, `Control+C`) |
| `I press '{value}' key {int} times` | Press key N times |
| `I hover over '{locator}'` | Hover over element |
| `I select '{value}' option from '{locator}' dropdown` | Select by text |
| `I select {int} option from '{locator}' dropdown` | Select by index |
| `I click '{value}' text in '{locator}' collection` | Click item in collection by text |
| `I upload '{value}' to '{locator}'` | Upload a file |
| `I scroll to '{locator}'` | Scroll element into view |
| `I scroll by '{value}'` | Scroll page by `x, y` offset |
| `I scroll by '{value}' in '{locator}'` | Scroll within element |

### Alerts & Dialogs

| Step | Description |
|------|-------------|
| `I will accept alert` | Accept the next alert |
| `I will dismiss alert` | Dismiss the next alert |
| `I will type '{value}' to alert` | Type into the next prompt |

### Validations

| Step | Description |
|------|-------------|
| `I expect '{locator}' {condition}` | Assert element condition (see Conditions) |
| `I expect text of '{locator}' {validation} '{value}'` | Assert element text |
| `I expect value of '{locator}' {validation} '{value}'` | Assert input value |
| `I expect '{attr}' attribute of '{locator}' {validation} '{value}'` | Assert attribute |
| `I expect '{prop}' property of '{locator}' {validation} '{value}'` | Assert property |
| `I expect '{expr}' custom property of '{locator}' {validation} '{value}'` | Assert via JS function (e.g. `$js(e => e.prop('value'))`) |
| `I expect '{prop}' css property of '{locator}' {validation} '{value}'` | Assert CSS property |
| `I expect current url {validation} '{value}'` | Assert current URL |
| `I expect page title {validation} '{value}'` | Assert page title |
| `I expect number of elements in '{locator}' collection {validation} '{value}'` | Assert collection count |
| `I expect every element in '{locator}' collection {condition}` | Assert all elements in collection |
| `I expect text of alert {validation} '{value}'` | Assert alert text |

**Conditions:** `to be visible`, `not to be visible`, `to be hidden`, `to be present`, `not to be present`, `to be enabled`, `to be disabled`, `to be in viewport`, `to be clickable`

**Validations:** `equal`, `strictly equal`, `deeply equal`, `contain`, `match`, `above`, `below`, `greater than`, `less than`, `have type`, `have property`, `have member`, `include members`, `case insensitive equal`, `satisfy`

### Memory Steps

| Step | Description |
|------|-------------|
| `I save text of '{locator}' as '{key}'` | Save element text |
| `I save value of '{locator}' as '{key}'` | Save input value |
| `I save '{attr}' attribute of '{locator}' as '{key}'` | Save attribute value |
| `I save '{prop}' property of '{locator}' as '{key}'` | Save property value |
| `I save '{expr}' custom property of '{locator}' as '{key}'` | Save JS expression result |
| `I save text of every element of '{locator}' collection as '{key}'` | Save array of texts |
| `I save current url as '{key}'` | Save current URL |
| `I save page title as '{key}'` | Save page title |
| `I save bounding rect of '{locator}' as '{key}'` | Save element bounding rect |
| `I save '{value}' to memory as '{key}'` | Store a literal value |
| `I set '{key}' = '{value}'` | Alias for save to memory |
| `I save json to memory as '{key}':` + docstring | Store a JSON object |
| `I save key-value pairs to memory as '{key}':` + table | Store a map |
| `I save multiline string to memory as '{key}':` + docstring | Store a multiline string |

### Mouse Interactions

| Step | Description |
|------|-------------|
| `I press {mouseButton} mouse button on '{value}'` | Press mouse button at `x, y` |
| `I release {mouseButton} mouse button on '{value}'` | Release mouse button at `x, y` |
| `I move mouse to '{value}'` | Move mouse to `x, y` |
| `I scroll mouse wheel by '{value}' on '{value}'` | Scroll wheel at `x, y` |

**Mouse buttons:** `left`, `right`, `middle`

### JavaScript Execution

| Step | Description |
|------|-------------|
| `I execute '{script}' function` | Execute JS in page context |
| `I execute '{script}' function and save result as '{key}'` | Execute and save return value |
| `I execute '{script}' function on '{locator}'` | Execute JS with element as `arguments[0]` |
| `I execute '{script}' function on '{locator}' and save result as '{key}'` | Execute on element and save result |

### Storage & Cookies

| Step | Description |
|------|-------------|
| `I set '{name}' cookie '{value}'` | Set a cookie |
| `I save value of '{name}' cookie as '{key}'` | Read a cookie |
| `I set '{key}' local storage value as '{value}'` | Set localStorage item |
| `I set '{key}' session storage value as '{value}'` | Set sessionStorage item |
| `I save value of '{key}' local storage as '{memKey}'` | Read localStorage item |
| `I save value of '{key}' session storage as '{memKey}'` | Read sessionStorage item |

### HTTP Requests

| Step | Description |
|------|-------------|
| `I create '{method}' request '{key}'` | Create HTTP request object (GET, POST, etc.) |
| `I create GraphQL request '{key}'` | Create GraphQL request object |
| `I add '{url}' url to '{request}'` | Set request URL |
| `I add headers to '{request}':` + table | Add headers (key/value table) |
| `I add body to '{request}':` + docstring | Set request body (JSON) |
| `I add form data body to '{request}':` + table | Set multipart form data |
| `I add query to GraphQL '{request}':` + docstring | Set GraphQL query |
| `I add variables to GraphQL '{request}':` + docstring | Set GraphQL variables |
| `I send '{request}' request and save response as '{key}'` | Send request and save response |

---

## Example Feature

```gherkin
Feature: Search

  Scenario: User searches for a product
    Given I open '$baseUrl' url
    When I type 'laptop' to 'Search Input'
    And I click 'Search Button'
    Then I expect number of elements in 'Results' collection above '0'
    And I save text of 'Results' as 'firstResult'
    And I expect '$firstResult' to contain 'laptop'
```

---

## Development

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Open Cypress GUI
npm run debug
```