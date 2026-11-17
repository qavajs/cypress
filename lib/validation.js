import { Then } from '@qavajs/cypress-runner-adapter';
import { dialogs } from './dialogs.js';
import { lazy } from './logger.js';
import { assertCondition } from './conditionExpect.js';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */

/**
 * Run validation against every element of collection inside retryable should callback
 * @param {Cypress.Chainable} collection
 * @param {(el: JQuery) => any} getActual - actual value getter
 * @param {Function} validation
 * @param {() => any} expectedValue - lazy expected value getter
 */
function shouldEvery(collection, getActual, validation, expectedValue) {
    collection.should($els => {
        for (const el of $els.toArray()) {
            validation(getActual(Cypress.$(el)), expectedValue());
        }
    });
}

/**
 * Verify element condition, retries until timeout
 * @param {Locator} locator - element to verify
 * @param {string} chainer - condition chainer
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {locator} {condition}', function (locator, chainer) {
    locator.should(chainer);
});

/**
 * Verify that text of element satisfies validation
 * @param {Locator} locator - element to get text of
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect text of 'Search Results (1)' to equal 'google'
 * @example I expect text of 'Search Results (2)' does not contain 'yandex'
 */
Then(
    'I expect text of {locator} {validation} {value}',
    function (locator, validation, value) {
        const expectedValue = lazy(value);
        locator.should(e => {
            validation(e.text(), expectedValue());
        });
    }
);

/**
 * Verify that value of input satisfies validation
 * @param {Locator} locator - input to get value of
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect value of 'Search Input' to equal 'google'
 */
Then(
    'I expect value of {locator} {validation} {value}',
    function (locator, validation, value) {
        const expectedValue = lazy(value);
        locator.should(e => {
            validation(e.val(), expectedValue());
        });
    }
);

/**
 * Verify that property of element satisfies validation
 * @param {MemoryValue} property - property name
 * @param {Locator} locator - element to get property of
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect 'value' property of 'Search Input' to be equal 'text'
 * @example I expect 'innerHTML' property of 'Label' to contain '<b>'
 */
Then(
    'I expect {value} property of {locator} {validation} {value}',
    function (property, locator, validation, value) {
        const propertyName = lazy(property);
        const expectedValue = lazy(value);
        locator.should(e => {
            validation(e.prop(propertyName()), expectedValue());
        });
    }
);

/**
 * Verify that attribute of element satisfies validation
 * @param {MemoryValue} attribute - attribute name
 * @param {Locator} locator - element to get attribute of
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect 'href' attribute of 'Home Link' to contain '/home'
 */
Then(
    'I expect {value} attribute of {locator} {validation} {value}',
    function (attribute, locator, validation, value) {
        const attributeName = lazy(attribute);
        const expectedValue = lazy(value);
        locator.should(e => {
            validation(e.attr(attributeName()), expectedValue());
        });
    }
);

/**
 * Verify that result of function called with element (jQuery) satisfies validation
 * @param {MemoryValue} property - function that receives element
 * @param {Locator} locator - element
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect '$js(e => e.prop("nodeName"))' custom property of 'Label' to equal 'SPAN'
 */
Then(
    'I expect {value} custom property of {locator} {validation} {value}',
    function (property, locator, validation, value) {
        const getScript = lazy(property);
        const expectedValue = lazy(value);
        locator.should(e => {
            validation(getScript()(e), expectedValue());
        });
    }
);

/**
 * Verify that current url satisfies validation
 * @param {Validation} validation - validation
 * @param {MemoryValue} expected - expected value
 * @example I expect current url to contain 'wikipedia'
 * @example I expect current url to equal 'https://wikipedia.org'
 */
Then(
    'I expect current url {validation} {value}',
    function (validation, expected) {
        cy.then(() => {
            const expectedUrl = expected.value();
            cy.url().should(actualUrl => {
                validation(actualUrl, expectedUrl);
            });
        });
    }
);

/**
 * Verify that number of elements in collection satisfies validation
 * @param {Locator} collection - collection
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect number of elements in 'Search Results' collection to equal '50'
 * @example I expect number of elements in 'Search Results' collection to be above '49'
 */
Then(
    'I expect number of elements in {locator} collection {validation} {value}',
    function (collection, validation, value) {
        const expectedValue = lazy(value);
        collection.should(c => {
            validation(c.length, expectedValue());
        });
    }
);

/**
 * Verify that page title satisfies validation
 * @param {Validation} validation - validation
 * @param {MemoryValue} expected - expected value
 * @example I expect page title to equal 'Wikipedia'
 */
Then(
    'I expect page title {validation} {value}',
    function (validation, expected) {
        cy.then(() => {
            const expectedTitle = expected.value();
            cy.title().should((actualTitle) => {
                validation(actualTitle, expectedTitle);
            });
        });
    }
);

/**
 * Verify that text of every element in collection satisfies validation
 * @param {Locator} collection - collection
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect text of every element in 'Search Results' collection to contain 'google'
 * @example I expect text of every element in 'Search Results' collection does not contain 'yandex'
 */
Then(
    'I expect text of every element in {locator} collection {validation} {value}',
    function (collection, validation, value) {
        const expectedValue = lazy(value);
        shouldEvery(collection, el => el.text(), validation, expectedValue);
    }
);

/**
 * Verify that attribute of every element in collection satisfies validation
 * @param {MemoryValue} attribute - attribute name
 * @param {Locator} collection - collection
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect 'href' attribute of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {value} attribute of every element in {locator} collection {validation} {value}',
    function (attribute, collection, validation, value) {
        const expectedValue = lazy(value);
        const attributeName = lazy(attribute);
        shouldEvery(collection, el => el.attr(attributeName()), validation, expectedValue);
    }
);

/**
 * Verify that property of every element in collection satisfies validation
 * @param {MemoryValue} property - property name
 * @param {Locator} collection - collection
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect 'href' property of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {value} property of every element in {locator} collection {validation} {value}',
    function (property, collection, validation, value) {
        const expectedValue = lazy(value);
        const propertyName = lazy(property);
        shouldEvery(collection, el => el.prop(propertyName()), validation, expectedValue);
    }
);

/**
 * Verify that result of function called with every element (jQuery) of collection satisfies validation
 * @param {MemoryValue} property - function that receives element
 * @param {Locator} collection - collection
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect '$js(e => e.prop("nodeName"))' custom property of every element in 'Search Results' collection to equal 'LI'
 */
Then(
    'I expect {value} custom property of every element in {locator} collection {validation} {value}',
    function (property, collection, validation, value) {
        const expectedValue = lazy(value);
        const getScript = lazy(property);
        shouldEvery(collection, el => getScript()(el), validation, expectedValue);
    }
);

/**
 * Verify that computed css property of element satisfies validation
 * @param {MemoryValue} property - css property name
 * @param {Locator} locator - element
 * @param {Validation} validation - validation
 * @param {MemoryValue} value - expected value
 * @example I expect 'color' css property of 'Search Input' to equal 'rgb(42, 42, 42)'
 * @example I expect 'font-family' css property of 'Label' to contain 'Fira'
 */
Then(
    'I expect {value} css property of {locator} {validation} {value}',
    function (property, locator, validation, value) {
        const propertyName = lazy(property);
        const expectedValue = lazy(value);
        locator.should(e => {
            validation(e.css(propertyName()), expectedValue());
        });
    }
);

/**
 * Verify text of the oldest dialog of current scenario that was not verified yet.
 * Waits for a dialog up to `defaultCommandTimeout`.
 * @param {Validation} validation - validation
 * @param {MemoryValue} expectedValue - expected value
 * @example I expect text of alert to equal 'Are you sure?'
 * @example I expect text of alert does not contain 'coffee'
 */
Then(
    'I expect text of alert {validation} {value}',
    function (validation, expectedValue) {
        // waits (up to defaultCommandTimeout) for a dialog of current scenario that was not validated yet
        cy.wrap(null, { log: false })
            .should(() => {
                expect(dialogs().messages, 'opened dialogs').to.not.be.empty;
            })
            .then(() => {
                const alertText = dialogs().messages.shift();
                validation(alertText, expectedValue.value());
            });

    }
);

/**
 * Verify condition of every element in collection, retries until timeout.
 * `not to be present` passes when collection is empty, other conditions require at least one element.
 * @param {Locator} collection - collection
 * @param {string} chainer - condition chainer
 * @example I expect every element in 'Search Results' collection to be visible
 * @example I expect every element in 'Loaders' collection not to be present
 */
Then('I expect every element in {locator} collection {condition}', function (collection, chainer) {
    collection.should($els => {
        if (chainer === 'not.exist') {
            expect($els, 'collection').to.not.exist;
            return;
        }
        expect($els, 'collection').to.exist;
        for (const el of $els.toArray()) {
            assertCondition(Cypress.$(el), chainer);
        }
    });
});
