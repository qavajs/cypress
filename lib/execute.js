import { When } from '@qavajs/cypress-runner-adapter';

/**
 * Execute client function
 * @param {string} functionKey - memory key of function
 * @example I execute '$fn' function // fn is function reference
 * @example I execute 'window.scrollBy(0, 100)' function
 */
When('I execute {value} function', function (functionKey) {
    const fnContent = functionKey.value();
    const fn = typeof fnContent === 'string' ? new Function(`return ${fnContent}`): fnContent;
    cy.window().then(win => {
        fn.apply(win);
    });
});

/**
 * Execute client function and save result into memory
 * @param {string} functionKey - memory key of function
 * @param {string} memoryKey - memory key to store result
 * @example I execute '$fn' function and save result as 'result' // fn is function reference
 * @example I execute 'window.scrollY' function and save result as 'scroll'
 */
When('I execute {value} function and save result as {value}', function (functionKey, memoryKey) {
    const fnContent = functionKey.value();
    const fn = typeof fnContent === 'string' ? new Function(`return ${fnContent}`): fnContent;
    cy.window().then(win => {
        memoryKey.set(fn.apply(win));
    });
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' // fn is function reference
 * @example I execute 'arguments[0].scrollIntoView()' function on 'Component > Element'
 */
When('I execute {value} function on {locator}', function (functionKey, locator) {
    const fnContent = functionKey.value();
    const fn = typeof fnContent === 'string' ? new Function(`return ${fnContent}`): fnContent;
    cy.window().then(win => {
        locator.then((e) => {
            fn.apply(win, e);
        });
    });
});

/**
 * Execute client function on certain element
 * @param {string} functionKey - memory key of function
 * @param {string} alias - alias of target element
 * @example I execute '$fn' function on 'Component > Element' and save result as 'innerText' // fn is function reference
 * @example I execute 'arguments[0].innerText' function on 'Component > Element' and save result as 'innerText'
 */
When(
    'I execute {value} function on {locator} and save result as {value}',
    function (functionKey, locator, memoryKey) {
        const fnContent = functionKey.value();
        const fn = typeof fnContent === 'string' ? new Function(`return ${fnContent}`): fnContent;
        cy.window().then(win => {
            locator.then((e) => {
                memoryKey.set(fn.apply(win, e));
            });
        });
    }
);
