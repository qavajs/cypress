import { Then } from '@qavajs/cypress-runner-adapter';
import { dataTable2Array } from './utils.js';
import { getValidation } from './valueExpect.js';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */
// simple validation

/**
 * Verify that value satisfies validation against other value
 * @param {MemoryValue} value1 - actual value
 * @param {Validation} validation - validation
 * @param {MemoryValue} value2 - expected value
 * @example I expect '$value' to equal '$anotherValue'
 * @example I expect '$value' does not contain '56'
 */
Then(
    'I expect {value} {validation} {value}',
    function (value1, validation, value2) {
        cy.then(() => {
            const val1 = value1.value();
            const val2 = value2.value();
            validation(val1, val2);
        });
    });

/**
 * Verify that at least N elements of array satisfy validation
 * @param {number} expectedNumber - minimal number of elements
 * @param {MemoryValue} arr - array
 * @param {Validation} validation - validation
 * @param {MemoryValue} expectedValue - expected value
 * @example I expect at least 1 element in '$arr' array to be above '$expectedValue'
 * @example I expect at least 2 elements in '$arr' array to be above '50'
 */
Then(
    'I expect at least {int} element(s) in {value} array {validation} {value}',
    function (expectedNumber, arr, validation, expectedValue) {
        cy.then(() => {
            const array = arr.value();
            const val = expectedValue.value();
            if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
            const errors = [];
            for (const value of array) {
                try {
                    validation(value, val);
                } catch (err) {
                    errors.push(err.message);
                }
            }
            const passed = array.length - errors.length;
            if (passed < expectedNumber) {
                throw new Error(
                    `Expected at least ${expectedNumber} element(s) of '${arr}' to pass validation, but ${passed} passed:\n` +
                    errors.join('\n')
                );
            }
        });
    }
);

/**
 * Verify that every element of array satisfies validation
 * @param {MemoryValue} arr - array
 * @param {Validation} validation - validation
 * @param {MemoryValue} expectedValue - expected value
 * @example I expect every element in '$arr' array to be above '$expectedValue'
 * @example I expect every element in '$arr' array to be above '50'
 */
Then(
    'I expect every element in {value} array {validation} {value}',
    function (arr, validation, expectedValue) {
        cy.then(() => {
            const array = arr.value();
            const val = expectedValue.value();
            if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
            for (const value of array) {
                validation(value, val);
            }
        });
    }
);

/**
 * Verify that array is sorted according to comparator.
 * Comparator is not provided by the module, as it depends on compared data.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * @param {MemoryValue} arr - array
 * @param {MemoryValue} comparator - comparator function
 * @example I expect '$arr' array to be sorted by '$ascending'
 */
Then(
    'I expect {value} array to be sorted by {value}',
    function (arr, comparator) {
        cy.then(() => {
            const array = arr.value();
            if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
            const comparatorFn = comparator.value();
            if (typeof comparatorFn !== 'function') throw new Error(`'${comparator}' is not implemented`);
            const arrayCopy = [...array];
            arrayCopy.sort(comparatorFn);
            const validation = getValidation('to deeply equal');
            validation(array, arrayCopy);
        });
    }
);

/**
 * Verify that array satisfies validation against array from one-column data table
 * @param {MemoryValue} arr - array
 * @param {Validation} validation - validation
 * @param {DataTable} members - expected values
 * @example
 * I expect '$arr' array to have members:
 *   | uno  |
 *   | dos  |
 *   | tres |
 */
Then(
    'I expect {value} array {validation}:',
    function (arr, validation, members) {
        cy.then(() => {
            const array = arr.value();
            const membersArray = dataTable2Array(this, members);
            validation(array, membersArray);
        });
    }
);

/**
 * Verify that value satisfies validation against at least one value of array
 * @param {MemoryValue} actual - actual value
 * @param {Validation} validation - validation
 * @param {MemoryValue} expected - array of expected values
 * @example I expect '$text' to equal at least one of '$js(["free", "11.99"])'
 */
Then(
    'I expect {value} {validation} at least one of {value}',
    function (actual, validation, expected) {
        cy.then(() => {
            const actualValue = actual.value();
            const expectedValues = expected.value();
            if (!(expectedValues instanceof Array)) throw new Error(`'${expected}' parameter is not an array`);
            const validate = (AR, ER) => validation(AR, ER);
            validateAnyOf(actualValue, expectedValues, validate);
        });
    }
);

/**
 * Verify that value satisfies validation against at least one value of data table
 * @param {MemoryValue} actual - actual value
 * @param {Validation} valueExpect - validation
 * @param {DataTable} expected - expected values
 * @example
 * I expect '$text' to equal at least one of:
 *   | free  |
 *   | 11.99 |
 */
Then(
    'I expect {value} {validation} at least one of:',
    function (actual, valueExpect, expected) {
        cy.then(() => {
            const actualValue = actual.value();
            const expectedValues = dataTable2Array(this, expected);
            validateAnyOf(actualValue, expectedValues, valueExpect);
        });
    }
);

/**
 * Verify that value satisfies validation against every value of array
 * @param {MemoryValue} actual - actual value
 * @param {Validation} valueExpect - validation
 * @param {MemoryValue} expected - array of expected values
 * @example I expect '$text' not to equal all of '$js(["free", "10.00"])'
 */
Then(
    'I expect {value} {validation} all of {value}',
    function (actual, valueExpect, expected) {
        cy.then(() => {
            const actualValue = actual.value();
            const expectedValues = expected.value();
            if (!(expectedValues instanceof Array)) throw new Error(`'${expected}' parameter is not an array`);
            const validation = (AR, ER) => valueExpect(AR, ER);
            validateAllOf(actualValue, expectedValues, validation);
        });
    }
);

/**
 * Verify that value satisfies validation against every value of data table
 * @param {MemoryValue} actual - actual value
 * @param {Validation} valueExpect - validation
 * @param {DataTable} expected - expected values
 * @example
 * I expect '$text' not to equal all of:
 *   | free  |
 *   | 10.00 |
 */
Then(
    'I expect {value} {validation} all of:',
    function (actual, valueExpect, expected) {
        cy.then(() => {
            const actualValue = actual.value();
            const expectedValues = dataTable2Array(this, expected);
            const validation = (AR, ER) => valueExpect(AR, ER);
            validateAllOf(actualValue, expectedValues, validation);
        });
    }
);

function validateAnyOf(AR, ERs, validation) {
    const errorCollector = [];
    for (const ER of ERs) {
        try {
            validation(AR, ER);
            return;
        } catch (err) {
            errorCollector.push(err);
        }
    }
    throw new Error(errorCollector.map(err => err.message).join('\n'));
}

function validateAllOf(AR, ERs, validation) {
    const errorCollector = [];
    for (const ER of ERs) {
        try {
            validation(AR, ER);
        } catch (err) {
            errorCollector.push(err);
        }
    }
    if (errorCollector.length > 0) {
        throw new Error(errorCollector.map(err => err.message).join('\n'));
    }
}
