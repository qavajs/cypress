import { When } from '@qavajs/cypress-runner-adapter';
import { parseCoords } from './utils';

/**
 * Opens provided url
 * @param {string} url - url to navigate
 * @example I open 'https://google.com'
 */
When('I open {string} url', function (url) {
    const urlValue = this.value(url);
    cy.visit(urlValue);
});

/**
 * Type text to element
 * @param {string} alias - element to type
 * @param {string} value - value to type
 * @example I type 'wikipedia' to 'Google Input'
 */
When('I type {string} to {string}', function (value, alias) {
    const element = this.element(alias);
    const typeValue = this.value(value);
    element.type(typeValue);
});
//
/**
 * Click element
 * @param {string} alias - element to click
 * @example I click 'Google Button'
 */
When('I click {string}', function (alias) {
    const element = this.element(alias);
    element.click();
});

/**
 * Click element via script
 * @param {string} alias - element to click
 * @example I force click 'Google Button'
 */
When('I force click {string}', function (alias) {
    const element = this.element(alias);
    element.click({force: true});
});

/**
 * Right click element
 * @param {string} alias - element to right click
 * @example I right click 'Google Button'
 */
When('I right click {string}', function (alias) {
    const element = this.element(alias);
    element.rightclick();
});

/**
 * Double click element
 * @param {string} alias - double element to click
 * @example I double click 'Google Button'
 */
When('I double click {string}', function (alias) {
    const element = this.element(alias);
    element.dblclick();
});

/**
 * Clear input
 * @param {string} alias - element to clear
 * @example I clear 'Google Input'
 */
When('I clear {string}', function (alias) {
    const element = this.element(alias);
    element.clear();
});

/**
 * Switch to parent frame
 * @example I switch to parent frame
 */
When('I switch to parent frame', function () {
    this.po.driver = cy;
});

/**
 * Switch to frame by index
 * @param {number} index - index to switch
 * @example I switch to 2 frame
 */
When('I switch to {int} frame', function (index) {
    const root = this.po.driver === cy ? cy.get('iframe') : this.po.driver.find('iframe');
    this.po.driver = root
        .eq(0)
        .then((iframe) => iframe.contents())
        .should('exist')
        .find('body');
});

/**
 * Switch to frame by alias
 * @param {string} index - alias to switch
 * @example I switch to 'IFrame' frame
 */
When('I switch to {string} frame', function (frameAlias) {
    const frame = this.element(frameAlias);
    this.po.driver = frame
        .then((iframe) => iframe.contents())
        .should('exist')
        .find('body');
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
When('I hover over {string}', function (alias) {
    const element = this.element(alias);
    element.trigger('mouseenter');
    element.trigger('mouseover');
    element.trigger('mousemove');
});

/**
 * Select option with certain text from select element
 * @param {string} option - option to select
 * @param {string} alias - alias of select
 * @example I select '1900' option from 'Registration Form > Date Of Birth'
 * @example I select '$dateOfBirth' option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {string} option from {string} dropdown', function (option, alias) {
    const optionValue = this.value(option);
    const select = this.element(alias);
    select.select(optionValue);
});

/**
 * Select option with certain text from select element
 * @param {number} optionIndex - index of option to select
 * @param {string} alias - alias of select
 * @example I select 1 option from 'Registration Form > Date Of Birth' dropdown
 */
When('I select {int}(st|nd|rd|th) option from {string} dropdown', function (optionIndex, alias) {
    const select = this.element(alias);
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
    'I click {string} text in {string} collection',
    function (value, alias) {
        const resolvedValue = this.value(value);
        const collection = this.element(alias);
        collection.filter(`:contains(${resolvedValue})`).click();
    }
);

/**
 * Scroll by provided offset
 * @param {string} - offset string in 'x, y' format
 * @example
 * When I scroll by '0, 100'
 */
When('I scroll by {string}', function (offset) {
    const [x, y] = parseCoords(this.value(offset));
    cy.scrollTo(x, y);
});

/**
 * Scroll by provided offset in element
 * @param {string} - offset string in 'x, y' format
 * @param {string} - element alias
 * @example
 * When I scroll by '0, 100' in 'Overflow Container'
 */
When('I scroll by {string} in {string}', function (offset, alias) {
    const [x, y] = parseCoords(this.value(offset));
    const element = this.element(alias);
    element.scrollTo(x, y);
});

/**
 * Scroll to certain element
 * @param {string} - element alias
 * @example
 * When I scroll to 'Some Element'
 */
When('I scroll to {string}', function (alias) {
    const element = this.element(alias);
    element.scrollIntoView()
});


/**
 * Provide file url to upload input
 * @param {string} alias - element to upload file
 * @param {string} value - file path
 * @example I upload '/folder/file.txt' to 'File Input'
 */
When('I upload {string} file to {string}', function (value, alias) {
    const element = this.element(alias);
    const filePath = this.value(value);
    element.selectFile(filePath);
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
When('I will type {string} to alert', function (value) {
    const resolvedValue = this.value(value);
    cy.window().then((win) => {
        win.prompt = () => resolvedValue;
    });
});
