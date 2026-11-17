import { When } from '@qavajs/cypress-runner-adapter';
import { dataTable2Object } from './utils.js';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */

/**
 * Save text of element to memory
 * @param {Locator} locator - element
 * @param {MemoryValue} key - memory key
 * @example I save text of 'Search Result' as 'firstSearchResult'
 */
When('I save text of {locator} as {value}', function (locator, key) {
    locator.then(e => {
        key.set(e.text());
    });
});

/**
 * Save value of input to memory
 * @param {Locator} locator - input
 * @param {MemoryValue} key - memory key
 * @example I save value of 'Search Input' as 'searchInput'
 */
When('I save value of {locator} as {value}', function (locator, key) {
    locator.then(e => {
        key.set(e.val());
    });
});

/**
 * Save property of element to memory
 * @param {MemoryValue} property - property name
 * @param {Locator} locator - element
 * @param {MemoryValue} key - memory key
 * @example I save 'checked' property of 'Checkbox' as 'checked'
 * @example I save '$prop' property of 'Checkbox' as 'checked'
 */
When('I save {value} property of {locator} as {value}', function (property, locator, key) {
    locator.then((e) => {
        key.set(e.prop(property.value()));
    });
});

/**
 * Save attribute of element to memory
 * @param {MemoryValue} attribute - attribute name
 * @param {Locator} locator - element
 * @param {MemoryValue} key - memory key
 * @example I save 'href' attribute of 'Link' as 'linkHref'
 */
When('I save {value} attribute of {locator} as {value}', function (attribute, locator, key) {
    locator.then(e => {
        key.set(e.attr(attribute.value()));
    });
});

/**
 * Save result of function called with element (jQuery) to memory
 * @param {MemoryValue} property - function that receives element
 * @param {Locator} locator - element
 * @param {MemoryValue} key - memory key
 * @example I save '$js(e => e.prop("nodeName"))' custom property of 'Checkbox' as 'nodeName'
 */
When('I save {value} custom property of {locator} as {value}', function (property, locator, key) {
    locator.then(element => {
        const script = property.value();
        key.set(script(element));
    });
});

/**
 * Save number of elements in collection to memory
 * @param {Locator} collection - collection
 * @param {MemoryValue} key - memory key
 * @example I save number of elements in 'Search Results' collection as 'numberOfSearchResults'
 */
When('I save number of elements in {locator} collection as {value}', function (collection, key) {
    collection.then(c => {
        key.set(c.length);
    });
});

/**
 * Save texts of all elements in collection to memory as array
 * @param {Locator} collection - collection
 * @param {MemoryValue} key - memory key
 * @example I save text of every element of 'Search Results' collection as 'searchResults'
 */
When(
    'I save text of every element of {locator} collection as {value}',
    function (collection, key) {
        collection.then((c) => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).text());
            });
            key.set(values);
        });
    }
);

/**
 * Save attribute of all elements in collection to memory as array
 * @param {MemoryValue} attribute - attribute name
 * @param {Locator} collection - collection
 * @param {MemoryValue} key - memory key
 * @example I save 'href' attribute of every element of 'Search > Links' collection as 'hrefs'
 */
When(
    'I save {value} attribute of every element of {locator} collection as {value}',
    function (attribute, collection, key) {
        collection.then((c) => {
            const attributeName = attribute.value();
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).attr(attributeName));
            });
            key.set(values);
        });
    }
);

/**
 * Save property of all elements in collection to memory as array
 * @param {MemoryValue} property - property name
 * @param {Locator} collection - collection
 * @param {MemoryValue} key - memory key
 * @example I save 'checked' property of every element of 'Search > Checkboxes' collection as 'checkboxes'
 */
When(
    'I save {value} property of every element of {locator} collection as {value}',
    function (property, collection, key) {
        collection.then(c => {
            const propertyName = property.value();
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).prop(propertyName));
            });
            key.set(values);
        });
    }
);

/**
 * Save results of function called with every element (jQuery) of collection to memory as array
 * @param {MemoryValue} propertyGetter - function that receives element
 * @param {Locator} collection - collection
 * @param {MemoryValue} key - memory key
 * @example I save '$js(e => e.prop("nodeName"))' custom property of every element of 'Search Results' collection as 'nodeNames'
 */
When(
    'I save {value} custom property of every element of {locator} collection as {value}',
    function (propertyGetter, collection, key) {
        collection.then(c => {
            const script = propertyGetter.value();
            const values = [];
            c.each(function () {
                values.push(script(Cypress.$(this)));
            });
            key.set(values);
        });
    }
);

/**
 * Save current url to memory
 * @param {MemoryValue} key - memory key
 * @example I save current url as 'currentUrl'
 */
When('I save current url as {value}', function (key) {
    cy.url().then(url => {
        key.set(url);
    });
});

/**
 * Save page title to memory
 * @param {MemoryValue} key - memory key
 * @example I save page title as 'currentTitle'
 */
When('I save page title as {value}', function (key) {
    cy.title().then(title => {
        key.set(title);
    });
});

/**
 * Save computed css property of element to memory
 * @param {MemoryValue} property - css property name
 * @param {Locator} locator - element
 * @param {MemoryValue} key - memory key
 * @example I save 'color' css property of 'Checkbox' as 'checkboxColor'
 * @example I save '$propertyName' css property of 'Checkbox' as 'checkboxColor'
 */
When('I save {value} css property of {locator} as {value}', function (property, locator, key) {
    locator.then(e => {
        key.set(e.css(property.value()));
    });
});

/**
 * Save bounding client rect (DOMRect) of element to memory
 * https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
 * @param {Locator} locator - element
 * @param {MemoryValue} key - memory key
 * @example
 * I save bounding rect of 'Node' as 'boundingRect'
 * Then I expect '$boundingRect.width' to equal '42'
 */
When('I save bounding rect of {locator} as {value}', function (locator, key) {
    locator.then(node => {
        key.set(node.get(0).getBoundingClientRect());
    });
});

/**
 * Save value to memory
 * @param {MemoryValue} expression - value or memory expression
 * @param {MemoryValue} key - memory key
 * @example I save 'value' to memory as 'key'
 * @example I save '$getRandomUser()' to memory as 'user'
 */
When(
    'I save {value} to memory as {value}',
    function (expression, key) {
        cy.then(() => {
            key.set(expression.value());
        });
    }
);

/**
 * Save multiline string to memory. Memory expressions in the string are resolved.
 * @param {MemoryValue} key - memory key
 * @param {string} multilineString - multiline string
 * @example
 * I save multiline string to memory as 'text':
 * """
 * first line
 * second line with $value
 * """
 */
When(
    'I save multiline string to memory as {value}:',
    /** @this {import('./setup.js').QavajsCypressWorld} */ function (key, multilineString) {
        cy.then(() => {
            key.set(this.value(multilineString));
        });
    }
);

/**
 * Save value to memory
 * @param {MemoryValue} key - memory key
 * @param {MemoryValue} expression - value or memory expression
 * @example I set 'key' = 'value'
 */
When(
    'I set {value} = {value}',
    function (key, expression) {
        cy.then(() => {
            key.set(expression.value());
        });
    }
);

/**
 * Parse JSON and save it to memory
 * @param {MemoryValue} key - memory key
 * @param {string} json - JSON string
 * @example
 * I save json to memory as 'key':
 * """
 * {
 *     "someKey": "someValue"
 * }
 * """
 */
When(
    'I save json to memory as {value}:',
    /** @this {import('./setup.js').QavajsCypressWorld} */ function (key, json) {
        cy.then(() => {
            key.set(JSON.parse(this.value(json)));
        });
    }
);

/**
 * Save object built from two-column data table to memory
 * @param {MemoryValue} key - memory key
 * @param {DataTable} kv - key-value data table
 * @example
 * I save key-value pairs to memory as 'key':
 * | someKey      | 42               |
 * | someOtherKey | $valueFromMemory |
 */
When(
    'I save key-value pairs to memory as {value}:',
    /** @this {import('./setup.js').QavajsCypressWorld} */ function (key, kv) {
        cy.then(() => {
            key.set(dataTable2Object(this, kv));
        });
    }
);
