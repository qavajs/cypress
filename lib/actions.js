import { When } from '@qavajs/cypress-runner-adapter';
import { parseCoords } from './utils';

/**
 * Opens provided url
 * @param {string} url - url to navigate
 * @example I open 'https://google.com'
 */
When('I open {value} url', function (url) {
    cy.visit(url.value());
});

/**
 * Type text to element
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' to 'Google Input'
 * @example I type 'wikipedia' into 'Google Input'
 */
When('I type {value} (in)to {locator}', function (type, locator) {
    locator.type(type.value());
});

/**
 * Click element
 * @param {string} alias - element to click
 * @example I click 'Google Button'
 */
When('I click {locator}', function (locator) {
    locator.click();
});

/**
 * Click element via script
 * @param {string} alias - element to click
 * @example I force click 'Google Button'
 */
When('I force click {locator}', function (locator) {
    locator.click({force: true});
});

/**
 * Right click element
 * @param {string} alias - element to right click
 * @example I right click 'Google Button'
 */
When('I right click {locator}', function (locator) {
    locator.rightclick();
});

/**
 * Double click element
 * @param {string} alias - double element to click
 * @example I double click 'Google Button'
 */
When('I double click {locator}', function (locator) {
    locator.dblclick();
});

/**
 * Clear input
 * @param {string} alias - element to clear
 * @example I clear 'Google Input'
 */
When('I clear {locator}', function (locator) {
    locator.clear();
});

/**
 * Refresh current page
 * @example I r efresh page
 */
When('I refresh page', function () {
    cy.reload();
});

/**
 * Press button
 * @param {string} key - key to press
 * @example I press 'Enter' key
 * @example I press 'Control+C' keys
 */
When('I press {string} key(s)', function (key) {
    cy.get('body').type(key);
});

/**
 * Press button given number of times
 * @param {string} key - key to press
 * @param {number} num - number of times
 * @example I press 'Enter' key 5 times
 * @example I press 'Control+V' keys 5 times
 */
When('I press {string} key(s) {int} time(s)', function (key, num) {
    for (let i = 0; i < num; i++) {
        cy.get('body').type(key);
    }
});

/**
 * Hover over element
 * @param {string} alias - element to hover over
 * @example I hover over 'Google Button'
 */
When('I hover over {locator}', function (locator) {
    locator.trigger('mouseenter');
    locator.trigger('mouseover');
    locator.trigger('mousemove');
});

/**
 * Select option with certain text from select element
 * @param {string} option - option to select
 * @param {string} alias - alias of select
 * @example I select '1900' option from 'Registration Form > Date Of Birth'
 * @example I select '$dateOfBirth' option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {value} option from {locator} dropdown', function (option, select) {
    select.select(option.value());
});

/**
 * Select option with certain text from select element
 * @param {number} optionIndex - index of option to select
 * @param {string} alias - alias of select
 * @example I select 1 option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {int}(st|nd|rd|th) option from {locator} dropdown', function (optionIndex, select) {
    select.select(optionIndex - 1);
});
//
/**
 * Click on element with desired text in collection
 * @param {string} expectedText - text to click
 * @param {string} alias - collection to search text
 * @example I click 'google' text in 'Search Engines' collection
 * @example I click '$someVarWithText' text in 'Search Engines' collection
 */
When(
    'I click {value} text in {locator} collection',
    function (text, collection) {
        collection.filter(`:contains(${text.value()})`).click();
    }
);

/**
 * Scroll by provided offset
 * @param {string} - offset string in 'x, y' format
 * @example
 * When I scroll by '0, 100'
 */
When('I scroll by {value}', function (offset) {
    const [x, y] = parseCoords(offset.value());
    cy.scrollTo(x, y);
});

/**
 * Scroll by provided offset in element
 * @param {string} - offset string in 'x, y' format
 * @param {string} - element alias
 * @example
 * When I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {value} in {locator}', function (offset, locator) {
    const [x, y] = parseCoords(offset.value());
    locator.scrollTo(x, y);
});

/**
 * Scroll to certain element
 * @param {string} - element alias
 * @example
 * When I scroll to 'Some Element'
 */
When('I scroll to {locator}', function (locator) {
    locator.scrollIntoView()
});


/**
 * Provide file url to upload input
 * @param {string} alias - element to upload file
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' to 'File Input'
 */
When('I upload {value} file to {locator}', function (filePath, locator) {
    locator.selectFile(filePath.value());
});

/**
 * Accept alert
 * @example I accept alert
 */
When('I will accept alert', function () {
    cy.window().then((win) => {
        win.alert = () => true;
        win.confirm = () => true;
    });
});

/**
 * Dismiss alert
 * Cypress automatically dismisses all dialogs. This step is just to make it implicitly.
 * @example I dismiss alert
 */
When('I will dismiss alert', function () {
    cy.window().then((win) => {
        win.alert = () => false;
        win.confirm = () => false;
    });
});

/**
 * I will type {string} to alert
 * @example I type 'coffee' to alert
 */
When('I will type {value} to alert', function (text) {
    cy.window().then((win) => {
        win.prompt = () => text.value();
    });
});
