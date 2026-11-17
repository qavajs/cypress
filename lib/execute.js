import { When } from '@qavajs/cypress-runner-adapter';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */

function toFunction(fnContent) {
    if (typeof fnContent !== 'string') return fnContent;
    try {
        return new Function(`return ${fnContent}`);
    } catch (e) {
        throw new Error(`Failed to parse function expression: "${fnContent}"\n${e.message}`, { cause: e });
    }
}

/**
 * Execute function in browser window (`this` is window).
 * String is evaluated as function body returning expression.
 * @param {MemoryValue} functionKey - function or expression
 * @example I execute '$fn' function
 * @example I execute 'window.scrollBy(0, 100)' function
 */
When('I execute {value} function', function (functionKey) {
    cy.window().then(win => {
        const fn = toFunction(functionKey.value());
        fn.apply(win);
    });
});

/**
 * Execute function in browser window and save result to memory
 * @param {MemoryValue} functionKey - function or expression
 * @param {MemoryValue} memoryKey - memory key
 * @example I execute '$fn' function and save result as 'result'
 * @example I execute 'window.scrollY' function and save result as 'scroll'
 */
When('I execute {value} function and save result as {value}', function (functionKey, memoryKey) {
    cy.window().then(win => {
        const fn = toFunction(functionKey.value());
        memoryKey.set(fn.apply(win));
    });
});

/**
 * Execute function with element as argument (`arguments[0]`)
 * @param {MemoryValue} functionKey - function or expression
 * @param {Locator} locator - element
 * @example I execute '$fn' function on 'Component > Element'
 * @example I execute 'arguments[0].scrollIntoView()' function on 'Component > Element'
 */
When('I execute {value} function on {locator}', function (functionKey, locator) {
    cy.window().then(win => {
        locator.then((e) => {
            const fn = toFunction(functionKey.value());
            fn.apply(win, e);
        });
    });
});

/**
 * Execute function with element as argument (`arguments[0]`) and save result to memory
 * @param {MemoryValue} functionKey - function or expression
 * @param {Locator} locator - element
 * @param {MemoryValue} memoryKey - memory key
 * @example I execute 'arguments[0].innerText' function on 'Component > Element' and save result as 'innerText'
 */
When(
    'I execute {value} function on {locator} and save result as {value}',
    function (functionKey, locator, memoryKey) {
        cy.window().then(win => {
            locator.then((e) => {
                const fn = toFunction(functionKey.value());
                memoryKey.set(fn.apply(win, e));
            });
        });
    }
);
