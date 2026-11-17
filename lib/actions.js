import { When } from '@qavajs/cypress-runner-adapter';
import { parseCoords } from './utils.js';
import { dialogs } from './dialogs.js';
import { lazy } from './logger.js';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */

/**
 * Open url
 * @param {MemoryValue} url - url to open
 * @example I open 'https://google.com' url
 * @example I open '$baseUrl' url
 */
When('I open {value} url', function (url) {
    cy.then(() => cy.visit(url.value()));
});

/**
 * Type text into element
 * @param {MemoryValue} type - text to type
 * @param {Locator} locator - element to type into
 * @example I type 'wikipedia' to 'Google Input'
 * @example I type '$query' into 'Search Form > Input'
 */
When('I type {value} (in)to {locator}', function (type, locator) {
    cy.then(() => locator.type(type.value()));
});

/**
 * Click element
 * @param {Locator} locator - element to click
 * @example I click 'Google Button'
 */
When('I click {locator}', function (locator) {
    locator.click();
});

/**
 * Click element skipping actionability checks
 * @param {Locator} locator - element to click
 * @example I force click 'Google Button'
 */
When('I force click {locator}', function (locator) {
    locator.click({ force: true });
});

/**
 * Right click element
 * @param {Locator} locator - element to right click
 * @example I right click 'Google Button'
 */
When('I right click {locator}', function (locator) {
    locator.rightclick();
});

/**
 * Double click element
 * @param {Locator} locator - element to double click
 * @example I double click 'Google Button'
 */
When('I double click {locator}', function (locator) {
    locator.dblclick();
});

/**
 * Clear input
 * @param {Locator} locator - input to clear
 * @example I clear 'Google Input'
 */
When('I clear {locator}', function (locator) {
    locator.clear();
});

/**
 * Clear input and type text
 * @param {Locator} locator - input to clear
 * @param {MemoryValue} type - text to type
 * @example I clear 'Google Input' and type 'wikipedia'
 */
When('I clear {locator} and type {value}', function (locator, type) {
    cy.then(() => locator.clear().type(type.value()));
});

/**
 * Reload current page
 * @example I refresh page
 * @example I reload page
 */
When('I refresh/reload page', function () {
    cy.reload();
});

/**
 * Navigate back or forward in browser history
 * @param {'back' | 'forward'} direction - direction
 * @example I go back
 * @example I go forward
 */
When('I go {browserButton}', function (direction) {
    cy.go(direction);
});

/**
 * Check checkbox or radio button
 * @param {Locator} locator - checkbox or radio button
 * @example I check 'Terms Checkbox'
 * @example I check 'Payment Form > Card Radio'
 */
When('I check {locator}', function (locator) {
    locator.check();
});

/**
 * Uncheck checkbox
 * @param {Locator} locator - checkbox
 * @example I uncheck 'Terms Checkbox'
 */
When('I uncheck {locator}', function (locator) {
    locator.uncheck();
});

/**
 * Press key or key combination (Cypress `type` syntax)
 * @param {MemoryValue} key - key sequence
 * @example I press '{enter}' key
 * @example I press '{ctrl}c' keys
 * @example I press '$submitKey' key
 */
When('I press {value} key(s)', function (key) {
    cy.then(() => {
        cy.get('body').type(key.value());
    });
});

/**
 * Press key or key combination given number of times
 * @param {MemoryValue} key - key sequence
 * @param {number} num - number of times
 * @example I press '{enter}' key 5 times
 * @example I press '{ctrl}v' keys 5 times
 * @example I press '$submitKey' key 2 times
 */
When('I press {value} key(s) {int} time(s)', function (key, num) {
    cy.then(() => {
        const keys = key.value();
        for (let i = 0; i < num; i++) {
            cy.get('body').type(keys);
        }
    });
});

/**
 * Hover over element.
 * Dispatches mouseenter/mouseover/mousemove events.
 * Synthetic events do not trigger CSS :hover styles (Cypress limitation).
 * @param {Locator} locator - element to hover over
 * @example I hover over 'Google Button'
 */
When('I hover over {locator}', function (locator) {
    locator
        .trigger('mouseenter')
        .trigger('mouseover')
        .trigger('mousemove');
});

/**
 * Select option of select element by text or value
 * @param {MemoryValue} option - option text or value
 * @param {Locator} select - select element
 * @example I select '1900' option from 'Registration Form > Date Of Birth' dropdown
 * @example I select '$dateOfBirth' option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {value} option from {locator} dropdown', function (option, select) {
    cy.then(() => select.select(option.value()));
});

/**
 * Select option of select element by 1-based index
 * @param {number} optionIndex - option index (starts from 1)
 * @param {Locator} select - select element
 * @example I select 1st option from 'Registration Form > Date Of Birth' dropdown
 * @example I select 3rd option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {int}(st)(nd)(rd)(th) option from {locator} dropdown', function (optionIndex, select) {
    select.select(optionIndex - 1);
});
/**
 * Click the first element of collection that contains text
 * @param {MemoryValue} text - text to search
 * @param {Locator} collection - collection to search in
 * @example I click 'google' text in 'Search Engines' collection
 * @example I click '$engine' text in 'Search Engines' collection
 */
When(
    'I click {value} text in {locator} collection',
    function (text, collection) {
        const expectedText = lazy(text);
        collection
            .filter((_, el) => Cypress.$(el).text().includes(String(expectedText())))
            .first()
            .click();
    }
);

/**
 * Scroll window to offset
 * @param {MemoryValue} offset - offset in 'x, y' format
 * @example I scroll by '0, 100'
 */
When('I scroll by {value}', function (offset) {
    cy.then(() => {
        const [x, y] = parseCoords(offset.value());
        cy.scrollTo(x, y);
    });
});

/**
 * Scroll element to offset
 * @param {MemoryValue} offset - offset in 'x, y' format
 * @param {Locator} locator - scrollable element
 * @example I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {value} in {locator}', function (offset, locator) {
    cy.then(() => {
        const [x, y] = parseCoords(offset.value());
        locator.scrollTo(x, y);
    });
});

/**
 * Scroll element into view
 * @param {Locator} locator - element to scroll to
 * @example I scroll to 'Some Element'
 */
When('I scroll to {locator}', function (locator) {
    locator.scrollIntoView();
});

/**
 * Select file in file input
 * @param {MemoryValue} filePath - file path (relative to project root) or Cypress.FileReference
 * @param {Locator} locator - file input
 * @example I upload './folder/file.txt' file to 'File Input'
 */
When('I upload {value} file to {locator}', function (filePath, locator) {
    cy.then(() => locator.selectFile(filePath.value()));
});

/**
 * Accept confirm dialogs of current scenario.
 * Alerts are always accepted by Cypress.
 * @example I will accept alert
 */
When('I will accept alert', function () {
    cy.then(() => {
        dialogs().confirm = true;
    });
});

/**
 * Dismiss confirm dialogs of current scenario.
 * Alerts can only be accepted, Cypress accepts them automatically.
 * @example I will dismiss alert
 */
When('I will dismiss alert', function () {
    cy.then(() => {
        dialogs().confirm = false;
    });
});

/**
 * Answer prompt dialogs of current scenario with text
 * @param {MemoryValue} text - text to answer
 * @example I will type 'coffee' to alert
 */
When('I will type {value} to alert', function (text) {
    cy.then(() => {
        dialogs().prompt = text.value();
    });
});
