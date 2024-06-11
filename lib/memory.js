import { When } from '@qavajs/cypress-runner-adapter';

/**
 * Save text of element to memory
 * @param {string} alias - element to get value
 * @param {string} key - key to store value
 * @example I save text of '#1 of Search Results' as 'firstSearchResult'
 */
When('I save text of {string} as {string}', function (alias, key) {
    const element = this.element(alias);
    element.then((e) => {
        this.setValue(key, e.text());
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
When('I save {string} property of {string} as {string}', function (property, alias, key) {
    const element = this.element(alias);
    const propertyName = this.value(property);
    element.then((e) => {
        this.setValue(key, e.prop(propertyName));
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
When('I save {string} attribute of {string} as {string}', function (attribute, alias, key) {
    const element = this.element(alias);
    const attributeName = this.value(attribute);
    element.then((e) => {
        this.setValue(key, e.attr(attributeName));
    });
});

/**
 * Save number of elements in collection to memory
 * @param {string} alias - collection to get value
 * @param {string} key - key to store value
 * @example I save number of elements in 'Search Results' as 'numberOfSearchResults'
 */
When('I save number of elements in {string} collection as {string}', function (alias, key) {
    const collection = this.element(alias);
    collection.then((c) => {
        this.setValue(key, c.length);
    });
});

/**
 * Save array of texts of collection to memory
 * @param {string} alias - collection to get values
 * @param {string} key - key to store value
 * @example I save text of every element of 'Search Results' collection as 'searchResults'
 */
When(
    'I save text of every element of {string} collection as {string}',
    function (alias, key) {
        const collection = this.element(alias);
        collection.then((c) => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).text());
            })
            this.setValue(key, values);
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
    'I save {string} attribute of every element of {string} collection as {string}',
    function (attribute, alias, key) {
        const collection = this.element(alias);
        collection.then((c) => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).attr(attribute));
            })
            this.setValue(key, values);
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
    'I save {string} property of every element of {string} collection as {string}',
    function (property, alias, key) {
        const collection = this.element(alias);
        collection.then((c) => {
            const values = [];
            c.each(function () {
                values.push(Cypress.$(this).prop(property));
            })
            this.setValue(key, values);
        });
    }
);

/**
 * Save current url to memory
 * @param {string} key - key to store value
 * @example I save current url as 'currentUrl'
 */
When('I save current url as {string}', function (key) {
    cy.url().then((url) => {
        this.setValue(key, url);
    });
});

/**
 * Save current page title to memory
 * @param {string} key - key to store value
 * @example I save page title as 'currentTitle'
 */
When('I save page title as {string}', function (key) {
    cy.title().then((title) => {
        this.setValue(key, title);
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
When('I save {string} css property of {string} as {string}', function (property, alias, key) {
    const propertyName = this.value(property);
    const element = this.element(alias);
    element.then((e) => {
        this.setValue(key, e.css(propertyName));
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
When('I save bounding rect of {string} as {string}', function (alias, key) {
    const element = this.element(alias);
    element.then(node => this.setValue(key, node.get(0).getBoundingClientRect()));
});
