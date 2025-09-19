# Change Log

All notable changes to the "@qavajs/cypress" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature
:beetle: - bugfix
:x: - deprecation/removal
:pencil: - chore
:microscope: - experimental

## [Unreleased]
- :rocket: added `into` preposition to type and type chars steps

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

