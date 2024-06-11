import { Then } from '@qavajs/cypress-runner-adapter';
import {getValidation} from './valueExpect';
import {dataTable2Array} from './utils';
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
    'I expect {string} {validation} {string}',
    function (value1, validationType, value2) {
        const val1 = this.value(value1);
        const val2 = this.value(value2);
        const validation = getValidation(validationType);
        validation(val1, val2);
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
    'I expect at least {int} element(s) in {string} array {validation} {string}',
    function (expectedNumber, arr, validationType, expectedValue) {
        const array = this.value(arr);
        const val = this.value(expectedValue);
        const failCounter = { fail: 0, pass: 0 };
        const validation = getValidation(validationType);
        for (const value of array) {
            try {
                validation(value, val);
                failCounter.pass++;
            } catch (err) {
                failCounter.fail++;
            }
        }
        if (failCounter.pass < expectedNumber) {
            throw new Error(`Less than ${expectedNumber} pass ${validationType} verification`);
        }
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
    'I expect every element in {string} array {validation} {string}',
    function (arr, validationType, expectedValue) {
        const array = this.value(arr);
        const val = this.value(expectedValue);
        const validation = getValidation(validationType);
        for (const value of array) {
            validation(value, val);
        }
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
    'I expect {string} array to be sorted by {string}',
    function (arr, comparator) {
        const array = this.value(arr);
        if (!Array.isArray(array)) throw new Error(`'${arr}' is not an array`);
        const comparatorFn = this.value(comparator);
        if (typeof comparatorFn !== 'function') throw new Error(`'${comparator}' is not implemented`);
        const arrayCopy = [...array];
        arrayCopy.sort(comparatorFn);
        const validation = getValidation('to deeply equal');
        validation(array, arrayCopy);
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
    'I expect {string} array {validation}:',
    function (arr, validationType, members) {
        const array = this.value(arr);
        const membersArray = dataTable2Array(this, members);
        const validation = getValidation(validationType);
        validation(array, membersArray);
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
    'I expect {string} {validation} at least one of {string}',
    function (actual, validationType, expected) {
        const actualValue = this.value(actual);
        const expectedValues = this.value(expected);
        if (!(expectedValues instanceof Array)) throw new Error(`'${expected}' parameter is not an array`);
        const validation = getValidation(validationType);
        const validate = (AR, ER) => validation(AR, ER);
        validateAnyOf(actualValue, expectedValues, validate);
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
    'I expect {string} {validation} at least one of:',
    function (actual, validationType, expected) {
    const actualValue = this.value(actual);
    const expectedValues = dataTable2Array(this, expected);
    const validation = (AR, ER) => valueExpect(AR, ER, validationType);
    validateAnyOf(actualValue, expectedValues, validation);
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
    'I expect {string} {validation} all of {string}',
    function (actual, validationType, expected) {
        const actualValue = this.value(actual);
        const expectedValues = this.value(expected);
        if (!(expectedValues instanceof Array)) throw new Error(`'${expected}' parameter is not an array`);
        const validation = (AR, ER) => valueExpect(AR, ER, validationType);
        validateAllOf(actualValue, expectedValues, validation);
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
    'I expect {string} {validation} all of:',
    function (actual, validationType, expected) {
    const actualValue = this.value(actual);
    const expectedValues = dataTable2Array(this, expected);
    const validation = (AR, ER) => valueExpect(AR, ER, validationType);
    validateAllOf(actualValue, expectedValues, validation);
}
);
