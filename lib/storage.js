import { When } from '@qavajs/cypress-runner-adapter';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */

/**
 * Set cookie. Value can be a string or Cypress.SetCookieOptions object with `value` property.
 * @param {MemoryValue} cookie - cookie name
 * @param {MemoryValue} value - cookie value or options
 * @example I set 'userID' cookie as 'user1'
 * @example I set 'userID' cookie as '$userIdCookie'
 */
When('I set {value} cookie as {value}', function (cookie, value) {
    cy.then(() => {
        const cookieValue = value.value();
        const cookieName = cookie.value();
        const cookieObject = typeof cookieValue === 'object' ? cookieValue : { value: cookieValue };
        cy.setCookie(cookieName, cookieObject.value, cookieObject);
    });
});

/**
 * Save cookie object (Cypress.Cookie) to memory
 * @param {MemoryValue} cookie - cookie name
 * @param {MemoryValue} key - memory key
 * @example I save value of 'auth' cookie as 'authCookie'
 */
When('I save value of {value} cookie as {value}', function (cookie, key) {
    cy.then(() => {
        cy.getCookie(cookie.value()).then((cookieValue) => {
            key.set(cookieValue);
        });
    });
});

/**
 * Set item of local or session storage
 * @param {MemoryValue} storageKey - storage key
 * @param {'local' | 'session'} storageType - storage type
 * @param {MemoryValue} value - value to set
 * @example I set 'username' local storage value as 'user1'
 * @example I set '$sessionStorageKey' session storage value as '$sessionStorageValue'
 */
When('I set {value} {storageType} storage value as {value}', function (storageKey, storageType, value) {
    cy.window().then((win) => {
        win[storageType + 'Storage'].setItem(storageKey.value(), value.value());
    });
});

/**
 * Save item of local or session storage to memory
 * @param {MemoryValue} storageKey - storage key
 * @param {'local' | 'session'} storageType - storage type
 * @param {MemoryValue} key - memory key
 * @example I save value of 'username' local storage as 'localStorageValue'
 * @example I save value of '$sessionStorageKey' session storage as 'sessionStorageValue'
 */
When('I save value of {value} {storageType} storage as {value}', function (storageKey, storageType, key) {
    cy.window().then((win) => {
        key.set(win[storageType + 'Storage'].getItem(storageKey.value()));
    });
});
