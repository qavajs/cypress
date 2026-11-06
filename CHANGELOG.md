# Change Log

All notable changes to the "@qavajs/cypress" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature
:beetle: - bugfix
:x: - deprecation/removal
:pencil: - chore
:microscope: - experimental

## [Unreleased]
- :rocket: network interception and mock steps (`I create interception/mock for ... as ...`, `I wait for result of ... interception`, `I set ... mock to respond ...`, `I set ... mock to abort`, `I restore ... mock`), work in `describe` and `it` modes
- :rocket: `I go back` / `I go forward`, `I check` / `I uncheck` (checkbox and radio), `I reload page`, `I clear ... and type ...` steps
- :rocket: `to be hidden` condition (alias of `to be invisible`)
- :rocket: unknown page object alias error suggests closest aliases and lists available ones
- :rocket: `above`, `below`, `greater than`, `less than` convert numeric strings of actual value (e.g. element text) to numbers
- :beetle: README step reference matches step definitions; unit test fails when they drift apart
- :x: `I send ... request` no longer fails on non-2xx status, the response is saved for validation. Set `failOnStatusCode: true` on the request to restore previous behavior
- :rocket: `log` option of `defineQavajs`: toggle memory/element/request entries, truncate long messages (`maxLength`), mask secrets (`mask`)
- :rocket: memory log entries show raw (not stringified) value in DevTools console
- :rocket: page object log entries show resolved chain items in DevTools console
- :rocket: HTTP requests are logged with masked request/response details and GraphQL operation name
- :beetle: `this.log` in custom steps is not reformatted as memory entry and is attached to the test report

## [3.1.0]
- :beetle: memory values are resolved at command execution time, so values saved by previous steps are available in `it` mode
- :beetle: removed unsupported `softly`, `match schema` and `... to` forms from `{validation}` parameter (they matched steps but threw at runtime)
- :beetle: page object component without selector (`locator.as(Component)`) keeps the scope of its parent
- :beetle: `every element` validations retry until timeout
- :beetle: alert steps use Cypress dialog events: settings survive navigation, `I expect text of alert` catches dialogs opened before the step and is not blocked by `I will accept/dismiss alert`
- :beetle: `I click '...' text in '...' collection` works with text containing special characters
- :beetle: `case insensitive equal` handles non-string values, clearer errors for invalid coordinates, empty page object path segments and `at least N elements` validation
- :beetle: storage steps accept only `local` and `session` storage types
- :rocket: exported `QavajsCypressWorld` and `MemoryValue` classes and types for custom steps
- :pencil: `defineQavajs` stores configuration in module scope instead of `window`; `memory` is optional
- :pencil: added `files` whitelist, removed `engines`
- :pencil: added unit tests and type check to CI

## [3.0.0]
- :rocket: bumped to Cypress `^16.0.0` and `@qavajs/cypress-runner-adapter` `^2.0.1`
- :x: switched `cypress.config.js` to ESM `import` syntax (breaking for CommonJS `require`-based configs)

## [2.9.0]
- :pencil: added TypeScript declaration files (`index.d.ts`, `po.d.ts`, `defineQavajs.d.ts`)
- :pencil: added `tsconfig.json`
- :pencil: added `types` and `exports` fields to `package.json`

## [2.8.2]
- :rocket: added `clickable` condition (checks element is visible and not disabled)
- :beetle: fixed `validateAllOf` exiting after first successful match instead of validating all values
- :beetle: fixed circular reference in `I expect {value} {validation} at least one of:` step
- :beetle: fixed `execute` steps throwing generic JS error on invalid function string — now surfaces a descriptive message
- :pencil: added `engines` field to `package.json` (`node >= 18`)

## [2.8.1]
- :beetle: fixed native selector logging to display `[function]` instead of function body

## [2.8.0]
- :rocket: improved memory and page object logging

## [2.7.0]
- :rocket: added logic to display resolved selector chain

## [2.6.0]
- :rocket: added `I save value of...` step

## [2.5.0]
- :rocket: added http steps

## [2.4.0]
- :rocket: added steps to work with custom properties (script results) in memory and validations
```gherkin
When I save '$js(element => element.prop("value"))' custom property of 'Element' as 'value'
Then I expect '$js(element => element.prop("value"))' custom property of 'Element' to be equal '123'
When I save '$js(element => element.prop("value"))' custom property of every element of 'Collection' collection as 'nodeNames'
Then I expect '$js(element => element.prop("value"))' custom property of every element in 'Collection' collection to equal 'LI'
```

## [2.3.1]
- :x: removed alias assignment in page object

## [2.3.0]
- :rocket: added `into` preposition to type and type chars steps
- :x: removed iframe steps
- :beetle: - fixed alert steps
- :beetle: - fixed desynchronization in validation steps 

## [2.2.0]
- :rocket: added `to satisfy` validation to verify user-defined expectation provided as predicate
```Gherkin
Then I expect '$value' to satisfy '$either(1, 2)'
```
where `$either` is a function
```typescript
function either(...expected) {
    return function (actual) {
        return expected.includes(actual)
    }
}
```

## [2.1.1]
- :beetle: replaced .as to Cypress.log in page object logging

## [2.1.0]
- :rocket: added page object logging

## [2.0.2]
- :beetle: added export of page object `locator` function

## [2.0.1]
- :beetle: fixed issue with getting child element

## [2.0.0]
- :rocket: implemented new page object approach

## [0.2.0]
- :rocket: added memory write logs support

## [0.1.1]
- :beetle: fix wrong import

## [0.1.0]
- :rocket: initial implementation

