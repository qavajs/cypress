import { When } from '@qavajs/cypress-runner-adapter';
import { parseCoords } from './utils';

/**
 * Press mouse key
 * @param {string} button - button to press (left, right, middle)
 * @example When I press left mouse button
 */
When('I press {mouseButton} mouse button on {string}', function (buttons, coords) {
    const [x, y] = parseCoords(this.value(coords));
    cy.get('body')
        .trigger('mouseenter', x, y)
        .trigger('mouseover', x, y)
        .trigger('mousemove', x, y)
        .trigger('mousedown', x, y, { buttons });
});

/**
 * Release mouse key
 * @param {string} button - button to release (left, right, middle)
 * @example When I release left mouse button
 */
When('I release {mouseButton} mouse button on {string}', function (button, coords) {
    const [x, y] = parseCoords(this.value(coords));
    cy.get('body')
        .trigger('mouseenter', x, y)
        .trigger('mouseover', x, y)
        .trigger('mousemove', x, y)
        .trigger('mouseup', x, y, { button });
});

/**
 * Move mouse to coordinates
 * @param {string} coords - x, y coordinates to move
 * @example When I move mouse to '10, 15'
 */
When('I move mouse to {string}', function (coords){
    const [x, y] = parseCoords(this.value(coords));
    cy.get('body')
        .trigger('mouseenter', x, y)
        .trigger('mouseover', x, y)
        .trigger('mousemove', x, y);
});

/**
 * Scroll mouse wheel by x, y offset
 * @param {string} coords - x, y offset to scroll
 * @example When I scroll mouse wheel by '0, 15'
 */
When('I scroll mouse wheel by {string} on {string}', function (offset, coords) {
    const [x, y] = parseCoords(this.value(coords));
    const [deltaX, deltaY] = parseCoords(this.value(offset));
    cy.get('body')
        .trigger('mouseenter', x, y)
        .trigger('mouseover', x, y)
        .trigger('mousemove', x, y)
        .trigger('wheel', x, y, { deltaX, deltaY });
});
