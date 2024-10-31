import { When } from '@qavajs/cypress-runner-adapter';

/**
 * Set cookie
 * @param {string} cookie - cookie name
 * @param {string} value - value to set
 * @example I set 'userID' cookie 'user1'
 * @example I set 'userID' cookie '$userIdCookie'
 */
When('I set {value} cookie as {value}', function (cookie, value) {
    const cookieValue = value.value();
    const cookieName = cookie.value();
    const cookieObject = typeof cookieValue === 'object' ? cookieValue : { value: cookieValue };
    cy.setCookie(cookieName, cookieObject.value, cookieObject);
});

/**
 * Save cookie value to memory
 * @param {string} cookie - cookie name
 * @param {string} key - memory key
 * @example I save value of 'auth' cookie as 'authCookie'
 */
When('I save value of {value} cookie as {value}', function (cookie, key) {
    const cookieName = cookie.value();
    cy.getCookie(cookieName).then((cookie) => {
        key.set(cookie);
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
When('I set {value} {word} storage value as {value}', function (storageKey, storageType, value) {
    const resolvedValue = value.value();
    const storageKeyName = storageKey.value();
    cy.window().then((win) => {
        console.log(win)
        win[storageType + 'Storage'].setItem(storageKeyName, resolvedValue);
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
When('I save value of {value} {word} storage as {value}', function (storageKey, storageType, key) {
    const resolvedStorageKey = storageKey.value();
    cy.window().then((win) => {
        key.set(win[storageType + 'Storage'].getItem(resolvedStorageKey));
    });
});
