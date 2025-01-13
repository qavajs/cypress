import { When } from '@qavajs/cypress-runner-adapter';
import { dataTable2Object } from './utils';

/**
 * Save text of element to memory
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save text of '#1 of Search Results' as 'firstSearchResult'
 */
When('I save text of {locator} as {value}', function (locator, key) {
    locator.then(e => {
        key.set(e.text());
    });
});

/**
 * Save property of element to memory
 * @param {string} property - property to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'checked' property of 'Checkbox' as 'checked'
 * @example I save '$prop' property of 'Checkbox' as 'checked'
 */
When('I save {value} property of {locator} as {value}', function (property, locator, key) {
    const propertyName = property.value();
    locator.then((e) => {
        key.set(e.prop(propertyName));
    });
});

/**
 * Save attribute of element to memory
 * @param {string} attribute - attribute to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'href' attribute of 'Link' as 'linkHref'
 * @example I save '$prop' attribute of 'Link' as 'linkHref'
 */
When('I save {value} attribute of {locator} as {value}', function (attribute, locator, key) {
    const attributeName = attribute.value();
    locator.then(e => {
        key.set(e.attr(attributeName));
    });
});

/**
 * Save number of elements in collection to memory
 * @param {string} alias - collection to get value
 * @param {string} key - key to store value
 * @example I save number of elements in 'Search Results' as 'numberOfSearchResults'
 */
When('I save number of elements in {locator} collection as {value}', function (collection, key) {
    collection.then(c => {
        key.set(c.length);
    });
});

/**
 * Save array of texts of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save text of every element of 'Search Results' collection as 'searchResults'
 */
When(
    'I save text of every element of {locator} collection as {value}',
    function (collection, key) {
        collection.then((c) => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).text());
            })
            key.set(values);
        });
    }
);

/**
 * Save array of attributes of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save 'checked' attribute of every element of 'Search > Checkboxes' collection as 'checkboxes'
 */
When(
    'I save {value} attribute of every element of {locator} collection as {value}',
    function (attribute, collection, key) {
        const attributeName = attribute.value();
        collection.then((c) => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).attr(attributeName));
            })
            key.set(values);
        });
    }
);

/**
 * Save array of property of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save 'href' property of every element of 'Search > Links' collection as 'hrefs'
 */
When(
    'I save {value} property of every element of {locator} collection as {value}',
    function (property, collection, key) {
        const propertyName = property.value();
        collection.then(c => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).prop(propertyName));
            })
            key.set(values);
        });
    }
);

/**
 * Save current url to memory
 * @param {string} key - key to store value
 * @example I save current url as 'currentUrl'
 */
When('I save current url as {value}', function (key) {
    cy.url().then(url => {
        key.set(url);
    });
});

/**
 * Save current page title to memory
 * @param {string} key - key to store value
 * @example I save page title as 'currentTitle'
 */
When('I save page title as {value}', function (key) {
    cy.title().then(title => {
        key.set(title);
    });
});

/**
 * Save css property of element to memory
 * @param {string} property - property to store
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save 'color' css property of 'Checkbox' as 'checkboxColor'
 * @example I save '$propertyName' property of 'Checkbox' as 'checkboxColor'
 */
When('I save {value} css property of {locator} as {value}', function (property, locator, key) {
    const propertyName = property.value();
    locator.then(e => {
        key.set(e.css(propertyName));
    });
});

/**
 * Save bounding client rect to memory
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example
 * When I save bounding rect of 'Node' as 'boundingRect'
 * Then I expect '$boundingRect.width' to equal '42'
 */
When('I save bounding rect of {locator} as {value}', function (locator, key) {
    locator.then(node => {
        key.set(node.get(0).getBoundingClientRect());
    });
});


/**
 * ##############################
 */


/**
 * Save value to memory
 * @param {string} alias - value to save or alias for previously saved value
 * @param {string} key - key to store value
 * @example I save 'value' to memory as 'key'
 * @example I save '$getRandomUser()' to memory as 'user'
 */
When(
    'I save {value} to memory as {value}',
    function (expression, key) {
        key.set(expression.value());
    }
);

When(
    'I save multiline string to memory as {value}:',
    function (key, multilineString) {
        const value = this.value(multilineString);
        key.set(value);
    }
);

/**
 * Save value to memory
 * @param {string} key - key to store value
 * @param {string} value - value to save or alias for previously saved value
 * @example I set 'key' = 'value'
 */
When(
    'I set {value} = {value}',
    function (key, expression) {
        key.set(expression.value());
    }
);

/**
 * Save json value to memory
 * @param {string} key - key to store value
 * @param {string} json - multiline string
 * @example I save json to memory as 'key':
 * """
 * {
 *     "someKey": "someValue"
 * }
 * """
 */
When(
    'I save json to memory as {value}:',
    function (key, json) {
        const value = this.value(json);
        key.set(JSON.parse(value));
    }
);

/**
 * Save key-value pairs to memory
 * @param {string} key - key to store value
 * @param {string} kv - key-value
 * @example I save key-value pairs to memory as 'key':
 * | someKey      | 42               |
 * | someOtherKey | $valueFromMemory |
 */
When(
    'I save key-value pairs to memory as {value}:',
    function (key, kv) {
        const value = dataTable2Object(this, kv);
        key.set(value);
    }
);
