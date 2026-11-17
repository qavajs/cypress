import { When } from '@qavajs/cypress-runner-adapter';
import { parseCoords } from './utils.js';

/** @typedef {import('./memoryValue.js').MemoryValue} MemoryValue */
/** @typedef {Cypress.Chainable<JQuery<HTMLElement>>} Locator */
/** @typedef {(actual: any, expected: any) => void} Validation */
/** @typedef {{ raw(): string[][], hashes(): Array<Record<string, string>> }} DataTable */

/**
 * Press mouse button at coordinates of page body
 * @param {{ button: number, buttons: number }} mouseButton - mouse button (left, right, middle)
 * @param {MemoryValue} coords - coordinates in 'x, y' format
 * @example I press left mouse button on '20, 500'
 */
When('I press {mouseButton} mouse button on {value}', function ({ button, buttons }, coords) {
    cy.then(() => {
        const [x, y] = parseCoords(coords.value());
        cy.get('body')
            .trigger('mouseenter', x, y)
            .trigger('mouseover', x, y)
            .trigger('mousemove', x, y)
            .trigger('mousedown', x, y, { button, buttons });
    });
});

/**
 * Release mouse button at coordinates of page body
 * @param {{ button: number, buttons: number }} mouseButton - mouse button (left, right, middle)
 * @param {MemoryValue} coords - coordinates in 'x, y' format
 * @example I release left mouse button on '20, 500'
 */
When('I release {mouseButton} mouse button on {value}', function ({ button }, coords) {
    cy.then(() => {
        const [x, y] = parseCoords(coords.value());
        cy.get('body')
            .trigger('mouseenter', x, y)
            .trigger('mouseover', x, y)
            .trigger('mousemove', x, y)
            .trigger('mouseup', x, y, { button, buttons: 0 });
    });
});

/**
 * Move mouse to coordinates of page body
 * @param {MemoryValue} coords - coordinates in 'x, y' format
 * @example I move mouse to '10, 15'
 */
When('I move mouse to {value}', function (coords) {
    cy.then(() => {
        const [x, y] = parseCoords(coords.value());
        cy.get('body')
            .trigger('mouseenter', x, y)
            .trigger('mouseover', x, y)
            .trigger('mousemove', x, y);
    });
});

/**
 * Scroll mouse wheel at coordinates of page body
 * @param {MemoryValue} offset - offset in 'x, y' format
 * @param {MemoryValue} coords - coordinates in 'x, y' format
 * @example I scroll mouse wheel by '0, 15' on '20, 500'
 */
When('I scroll mouse wheel by {value} on {value}', function (offset, coords) {
    cy.then(() => {
        const [x, y] = parseCoords(coords.value());
        const [deltaX, deltaY] = parseCoords(offset.value());
        cy.get('body')
            .trigger('mouseenter', x, y)
            .trigger('mouseover', x, y)
            .trigger('mousemove', x, y)
            .trigger('wheel', x, y, { deltaX, deltaY });
    });
});
