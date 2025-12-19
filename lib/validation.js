import { Then } from '@qavajs/cypress-runner-adapter';

/**
 * Verify element condition
 * @param {string} alias - element to wait condition
 * @param {string} condition - wait condition
 * @example I expect 'Header' to be visible
 * @example I expect 'Loading' not to be present
 * @example I expect 'Search Bar > Submit Button' to be clickable
 */
Then('I expect {locator} {condition}', function (locator, chainer) {
    locator.should(chainer);
});

/**
 * Verify that text of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validation - validation
 * @param {string} value - expected result
 * @example I expect text of '#1 of Search Results' equals to 'google'
 * @example I expect text of '#2 of Search Results' does not contain 'yandex'
 */
Then(
    'I expect text of {locator} {validation} {value}',
    function (locator, validation, value) {
        const expectedValue = value.value();
        locator.should(e => {
            validation(e.text(), expectedValue);
        });
    }
);

/**
 * Verify that value of element satisfies condition
 * @param {string} alias - element to get text
 * @param {string} validation - validation
 * @param {string} value - expected result
 * @example I expect value of '#1 of Search Results' equals to 'google'
 * @example I expect value of '#2 of Search Results' does not contain 'yandex'
 */
Then(
    'I expect value of {locator} {validation} {value}',
    function (locator, validation, value) {
        const expectedValue = value.value();
        locator.should(e => {
            validation(e.val(), expectedValue);
        });
    }
);

/**
 * Verify that property of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validation - validation
 * @param {string} value - expected value
 * @example I expect 'value' property of 'Search Input' to be equal 'text'
 * @example I expect 'innerHTML' property of 'Label' to contain '<b>'
 */
Then(
    'I expect {value} property of {locator} {validation} {value}',
    function (property, locator, validation, value) {
        const propertyName = property.value();
        const expectedValue = value.value();
        locator.should(e => {
            validation(e.prop(propertyName), expectedValue);
        });
    }
);

/**
 * Verify that attribute of element satisfies condition
 * @param {string} attribute - element to verify
 * @param {string} alias - element to verify
 * @param {string} validation - validation
 * @param {string} value - expected value
 * @example I expect 'href' attribute of 'Home Link' to contain '/home'
 */
Then(
    'I expect {value} attribute of {locator} {validation} {value}',
    function (attribute, locator, validation, value) {
        const attributeName = attribute.value();
        const expectedValue = value.value();
        locator.should(e => {
            validation(e.attr(attributeName), expectedValue);
        });
    }
);

/**
 * Verify that custom property (script result) of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validation - validation
 * @param {string} value - expected value
 * @example I expect '$js(e => e.first().prop("nodeName"))' custom property of 'Search Result' to be equal 'LI'
 * @example I expect '$js(e => e.first().prop("nodeName"))' property of 'Label' to contain 'span'
 */
Then(
    'I expect {value} custom property of {locator} {validation} {value}',
    function (property, locator, validation, value) {
        const script = property.value();
        const expectedValue = value.value();
        locator.should(e => {
            validation(script(e), expectedValue);
        });
    }
);

/**
 * Verify that current url satisfies condition
 * @param {string} validation - validation
 * @param {string} expected - expected value
 * @example I expect current url contains 'wikipedia'
 * @example I expect current url equals 'https://wikipedia.org'
 */
Then(
    'I expect current url {validation} {value}',
    function (validation, expected) {
        const expectedUrl = expected.value();
        cy.url().should(actualUrl => {
            validation(actualUrl, expectedUrl);
        });
    }
);

/**
 * Verify that number of element in collection satisfies condition
 * @param {string} alias - collection to verify
 * @param {string} validation - validation
 * @param {string} value - expected value
 * @example I expect number of elements in 'Search Results' collection to be equal '50'
 * @example I expect number of elements in 'Search Results' collection to be above '49'
 * @example I expect number of elements in 'Search Results' collection to be below '51'
 */
Then(
    'I expect number of elements in {locator} collection {validation} {value}',
    function (collection, validation, value) {
        const expectedValue = value.value();
        collection.should(collection => {
            validation(collection.length, expectedValue);
        });
    }
);

/**
 * Verify that page title satisfies condition
 * @param {string} validation - validation
 * @param {string} expected - expected value
 * @example I expect page title equals 'Wikipedia'
 */
Then(
    'I expect page title {validation} {value}',
    function (validation, expected) {
        const expectedTitle = expected.value();
        cy.title().should((actualTitle) => {
            validation(actualTitle, expectedTitle);
        });
    }
);

/**
 * Verify that all texts in collection satisfy condition
 * @param {string} alias - collection to get texts
 * @param {string} validation - validation
 * @param {string} value - expected result
 * @example I expect text of every element in 'Search Results' collection equals to 'google'
 * @example I expect text of every element in 'Search Results' collection does not contain 'yandex'
 */
Then(
    'I expect text of every element in {locator} collection {validation} {value}',
    function (collection, validation, value) {
        const expectedValue = value.value();
        collection.each(element => {
            validation(element.text(), expectedValue);
        });
    }
);

/**
 * Verify that all particular attributes in collection satisfy condition
 * @param {string} alias - collection to get attrs
 * @param {string} validation - validation
 * @param {string} value - expected result
 * @example I expect 'href' attribute of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {value} attribute of every element in {locator} collection {validation} {value}',
    function (attribute, collection, validation, value) {
        const expectedValue = value.value();
        const attributeName = attribute.value();
        collection.each(element => {
            validation(element.attr(attributeName), expectedValue);
        });
    }
);

/**
 * Verify that all particular properties in collection satisfy condition
 * @param {string} alias - collection to get props
 * @param {string} validation - validation
 * @param {string} value - expected result
 * @example I expect 'href' property of every element in 'Search Results' collection to contain 'google'
 */
Then(
    'I expect {value} property of every element in {locator} collection {validation} {value}',
    function (property, collection, validation, value) {
        const expectedValue = value.value();
        const propertyName = property.value();
        collection.each(element => {
            validation(element.prop(propertyName), expectedValue);
        });
    }
);

/**
 * Verify that custom property of all elements in collection satisfy condition
 * @param {string} propertyGetter - property getter script
 * @param {string} alias - collection to get props
 * @param {string} validation - validation
 * @param {string} value - expected result
 * @example I expect '$js(e => e.first().prop("nodeName"))' property of every element in 'Search Results' collection to contain 'LI'
 */
Then(
    'I expect {value} custom property of every element in {locator} collection {validation} {value}',
    function (property, collection, validation, value) {
        const expectedValue = value.value();
        const script = property.value();
        collection.each(element => {
            validation(script(element), expectedValue);
        });
    }
);

/**
 * Verify that css property of element satisfies condition
 * @param {string} property - element to verify
 * @param {string} alias - element to verify
 * @param {string} validation - validation
 * @param {string} value - expected value
 * @example I expect 'color' css property of 'Search Input' to be equal 'rgb(42, 42, 42)'
 * @example I expect 'font-family' css property of 'Label' to contain 'Fira'
 */
Then(
    'I expect {value} css property of {locator} {validation} {value}',
    function (property, locator, validation, value) {
        const propertyName = property.value();
        const expectedValue = value.value();
        locator.should(e => {
            validation(e.css(propertyName), expectedValue);
        });
    }
);

/**
 * Verify that text of an alert meets expectation
 * @param {string} validation - validation
 * @param {string} value - expected text value
 * @example I expect text of alert does not contain 'coffee'
 */
Then(
    'I expect text of alert {validation} {value}',
    function (validation, expectedValue) {
        const alertHandler = new Cypress.Promise((resolve) => {
            cy.on('window:alert', (alertText) => {
                resolve(alertText)
            });
            cy.on('window:confirm', (alertText) => {
                resolve(alertText)
            });
        });
        cy.then(() => {
            return alertHandler.then(alertText => {
                validation(alertText, expectedValue.value())
            });
        })

    }
);

/**
 * Verify collection condition
 * @param {string} alias - collection to wait condition
 * @param {string} condition - wait condition
 * @example I expect every element in 'Header' collection to be visible
 * @example I expect every element in 'Search Bar > Submit Button' collection not to be present
 */
Then('I expect every element in {locator} collection {condition}', function (collection, chainer) {
    collection.each(locator => {
        cy.wrap(locator).should(chainer);
    });
});