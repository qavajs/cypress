import { Then } from '@qavajs/cypress-runner-adapter';
import { dataTable2Array } from './utils';
import { getValidation } from './valueExpect';
// simple validation

/**
 * Verify that value from memory satisfies validation against other value
 * @param {string} value1 - first value
 * @param {string} validation - validation
 * @param {string} value2 - second value
 * @example I expect '$value' equals to '$anotherValue'
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
 * Verify that at least x elements in array pass validation
 * @param {string} arr - arr
 * @param {string} validation - validation
 * @param {string} expectedValue - expected value
 * @example I expect at least 1 element in '$arr' array to be above '$expectedValue'
 * @example I expect at least 2 elements in '$arr' array to be above '50'
 */
Then(
    'I expect at least {int} element(s) in {value} array {validation} {value}',
    function (expectedNumber, arr, validation, expectedValue) {
        cy.then(() => {
            const array = arr.value();
            const val = expectedValue.value();
            const failCounter = { fail: 0, pass: 0 };
            for (const value of array) {
                try {
                    validation(value, val);
                    failCounter.pass++;
                } catch (err) {
                    failCounter.fail++;
                }
            }
            if (failCounter.pass < expectedNumber) {
                throw new Error(`Less than ${expectedNumber} pass ${validation} verification`);
            }
        });
    }
);

/**
 * Verify that every element in array satisfies validation against other value
 * @param {string} arr - arr
 * @param {string} validation - validation
 * @param {string} expectedValue - expected value
 * @example I expect every element in '$arr' array to be above '$expectedValue'
 * @example I expect every element in '$arr' array to be above '50'
 */
Then(
    'I expect every element in {value} array {validation} {value}',
    function (arr, validation, expectedValue) {
        cy.then(() => {
            const array = arr.value();
            const val = expectedValue.value();
            for (const value of array) {
                validation(value, val);
            }
        });
    }
);

/**
 * Verify that array is sorted by
 * @param {string} arr - memory key of array
 * @param {string} comparator - memory key of sort comparator function https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description
 * Important module does not include implementation of sorting function,
 * as it may have various implementations for different types of compared data
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
 * Verify that array value from memory satisfies validation against other array in form of data table
 * @param {string} arr - memory key of array
 * @param {string} validation - validation
 * @param {DataTable} expected - expected array
 * @example
 * When I expect '$arr' array to have members:
 *  | uno  |
 *  | dos  |
 *  | tres |
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
 * Verify that the value satisfies validation with at least one value from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' to equal at least one of '$js(["free", "11.99"])'
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
 * Verify that the value satisfies validation with at least one value from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' to equal at least one of:
 *     | free  |
 *     | 11.99 |
 */
Then(
    'I expect {value} {validation} at least one of:',
    function (actual, valueExpect, expected) {
        cy.then(() => {
            const actualValue = actual.value();
            const expectedValues = dataTable2Array(this, expected);
            const validation = (AR, ER) => valueExpect(AR, ER, validation);
            validateAnyOf(actualValue, expectedValues, validation);
        });
}
);

/**
 * Verify that the value satisfies validation with all values from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' not to equal all of '$js(["free", "10.00"])'
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
 * Verify that the value satisfies validation with all values from the array
 * @param {string} actual - value to verify
 * @param {string} validation - validation
 * @param {string} expected - array of expected values
 * @example
 * When I expect '$text' not to equal all of:
 *    | free  |
 *    | 10.00 |
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

function validateAnyOf(AR, ERs, validation){
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

function validateAllOf(AR, ERs, validation){
    const errorCollector = [];
    for (const ER of ERs) {
        try {
            validation(AR, ER);
            return;
        } catch (err) {
            errorCollector.push(err);
        }
    }
    if (errorCollector.length > 0) {
        throw new Error(errorCollector.map(err => err.message).join('\n'));
    }
}