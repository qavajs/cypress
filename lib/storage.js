import { When } from '@qavajs/cypress-runner-adapter';

/**
 * Set cookie
 * @param {string} cookie - cookie name
 * @param {string} value - value to set
 * @example I set 'userID' cookie 'user1'
 * @example I set 'userID' cookie '$userIdCookie'
 */
When('I set {string} cookie as {string}', function (cookie, value) {
    const cookieValue = this.value(value);
    const cookieObject = typeof cookieValue === 'object' ? cookieValue : { value: cookieValue };
    cy.setCookie(cookie, cookieObject.value, cookieObject);
});

/**
 * Save cookie value to memory
 * @param {string} cookie - cookie name
 * @param {string} key - memory key
 * @example I save value of 'auth' cookie as 'authCookie'
 */
When('I save value of {string} cookie as {string}', function (cookie, key) {
    const cookieName = this.value(cookie);
    cy.getCookie(cookieName).then((cookie) => {
        this.setValue(key, cookie);
    });
});


/**
 * Set value of local/session storage
 * @param {string} storageKey - local/session storage key to set value
 * @param {string} storageType - storage type (local or session)
 * @param {string} value - value to set
 * @example I set 'username' local storage value as 'user1'
 * @example I set '$sessionStorageKey' session storage value as '$sessionStorageValue'
 */
When('I set {string} {word} storage value as {string}', function (storageKey, storageType, value) {
    const resolvedValue = this.value(value);
    cy.window().then((win) => {
        console.log(win)
        win[storageType + 'Storage'].setItem(storageKey, resolvedValue);
    });
});

/**
 * Save value of local/session storage to memory
 * @param {string} storageKey - local/session storage key to set value
 * @param {string} storageType - storage type (local or session)
 * @param {string} key - memory key
 * @example I save value of 'username' local storage as 'localStorageValue'
 * @example I save value of '$sessionStorageKey' session storage value as 'sessionStorageValue'
 */
When('I save value of {string} {word} storage as {string}', function (storageKey, storageType, key) {
    const resolvedStorageKey = this.value(storageKey);
    cy.window().then((win) => {
        this.setValue(key, win[storageType + 'Storage'].getItem(resolvedStorageKey));
    });
});
