import { Then } from '@qavajs/cypress-runner-adapter';
import { getValidation } from './valueExpect';
import { getConditionExpect } from './conditionExpect';

/**
 * Verify element condition
 * @param {string} alias - element to wait condition
 * @param {string} condition - wait condition
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {string} {conditionExpect}', function (alias, condition) {
    const chainer = getConditionExpect(condition);
    const element = this.element(alias);
    element.should(chainer)
});

/**
 * Verify that text of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of '#1 of Search Results' equals to 'google'
 * @example I expect text of '#2 of Search Results' does not contain 'yandex'
 */
Then(
    'I expect text of {string} {validation} {string}',
    function (alias, validationType, value) {
        const expectedValue = this.value(value);
        const element = this.element(alias);
        const validation = getValidation(validationType);
        element.should((e) => {
            validation(e.text(), expectedValue);
        });
    }
);

/**
 * Verify that value of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect value of '#1 of Search Results' equals to 'google'
 * @example I expect value of '#2 of Search Results' does not contain 'yandex'
 */
Then(
    'I expect value of {string} {validation} {string}',
    function (alias, validationType, value) {
        const expectedValue = this.value(value);
        const element = this.element(alias);
        const validation = getValidation(validationType);
        element.should((e) => {
            validation(e.val(), expectedValue);
        });
    }
);

/**
 * Verify that property of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'value' property of 'Search Input' to be equal 'text'
 * @example I expect 'innerHTML' property of 'Label' to contain '<b>'
 */
Then(
    'I expect {string} property of {string} {validation} {string}',
    function (property, alias, validationType, value) {
        const propertyName = this.value(property);
        const expectedValue = this.value(value);
        const element = this.element(alias);
        const validation = getValidation(validationType);
        element.should((e) => {
            validation(e.prop(propertyName), expectedValue);
        });
    }
);

/**
 * Verify that attribute of element satisfies condition
 * @param {string} attribute - element to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'href' attribute of 'Home Link' to contain '/home'
 */
Then(
    'I expect {string} attribute of {string} {validation} {string}',
    function (attribute, alias, validationType, value) {
        const attributeName = this.value(attribute);
        const expectedValue = this.value(value);
        const element = this.element(alias);
        const validation = getValidation(validationType);
        element.should((e) => {
            validation(e.attr(attributeName), expectedValue);
        });
    }
);

/**
 * Verify that current url satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect current url contains 'wikipedia'
 * @example I expect current url equals 'https://wikipedia.org'
 */
Then(
    'I expect current url {validation} {string}',
    function (validationType, expected) {
        const validation = getValidation(validationType);
        const expectedUrl = this.value(expected);
        cy.url().should((actualUrl) => {
            validation(actualUrl, expectedUrl);
        });
    }
);

/**
 * Verify that number of element in collection satisfies condition
 * @param {string} alias - collection to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect number of elements in 'Search Results' collection to be equal '50'
 * @example I expect number of elements in 'Search Results' collection to be above '49'
 * @example I expect number of elements in 'Search Results' collection to be below '51'
 */
Then(
    'I expect number of elements in {string} collection {validation} {string}',
    function (alias, validationType, value) {
        const expectedValue = this.value(value);
        const collection = this.element(alias);
        const validation = getValidation(validationType);
        collection.should((collection) => {
            validation(collection.length, expectedValue);
        });
    }
);

/**
 * Verify that page title satisfies condition
 * @param {string} validationType - validation
 * @param {string} expected - expected value
 * @example I expect page title equals 'Wikipedia'
 */
Then(
    'I expect page title {validation} {string}',
    function (validationType, expected) {
        const validation = getValidation(validationType);
        const expectedTitle = this.value(expected);
        cy.title().should((actualTitle) => {
            validation(actualTitle, expectedTitle);
        });
    }
);

/**
 * Verify that all texts in collection satisfy condition
 * @param {string} alias - collection to get texts
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect text of every element in 'Search Results' collection equals to 'google'
 * @example I expect text of every element in 'Search Results' collection does not contain 'yandex'
 */
Then(
    'I expect text of every element in {string} collection {validation} {string}',
    function (alias, validationType, value) {
        const expectedValue = this.value(value);
        const collection = this.element(alias);
        const validation = getValidation(validationType);
        collection.each((element) => {
            validation(element.text(), expectedValue);
        });
    }
);

/**
 * Verify that all particular attributes in collection satisfy condition
 * @param {string} alias - collection to get attrs
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect 'href' attribute of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {string} attribute of every element in {string} collection {validation} {string}',
    function (attribute, alias, validationType, value) {
        const expectedValue = this.value(value);
        const collection = this.element(alias);
        const validation = getValidation(validationType);
        collection.each((element) => {
            validation(element.attr(attribute), expectedValue);
        });
    }
);

/**
 * Verify that all particular properties in collection satisfy condition
 * @param {string} alias - collection to get props
 * @param {string} validationType - validation
 * @param {string} value - expected result
 * @example I expect 'href' property of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {string} property of every element in {string} collection {validation} {string}',
    function (property, alias, validationType, value) {
        const expectedValue = this.value(value);
        const collection = this.element(alias);
        const validation = getValidation(validationType);
        collection.each((element) => {
            validation(element.prop(property), expectedValue);
        });
    }
);

/**
 * Verify that css property of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validationType - validation
 * @param {string} value - expected value
 * @example I expect 'color' css property of 'Search Input' to be equal 'rgb(42, 42, 42)'
 * @example I expect 'font-family' css property of 'Label' to contain 'Fira'
 */
Then(
    'I expect {string} css property of {string} {validation} {string}',
    function (property, alias, validationType, value) {
        const propertyName = this.value(property);
        const expectedValue = this.value(value);
        const element = this.element(alias);
        const validation = getValidation(validationType);
        element.should((e) => {
            validation(e.css(propertyName), expectedValue);
        });
    }
);

/**
 * Verify that text of an alert meets expectation
 * @param {string} validationType - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
Then(
    'I expect text of alert {validation} {string}',
    function (validationType, expectedValue) {
        const validation = getValidation(validationType);
        const alertHandler = new Cypress.Promise((resolve, reject) => {
            cy.on('window:alert', (alertText)=> {
                resolve(alertText)
            });
            cy.on('window:confirm', (alertText)=> {
                resolve(alertText)
            });
        });
        return alertHandler.then(alertText => { validation(alertText, expectedValue) })
    }
);

