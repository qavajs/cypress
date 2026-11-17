import { installFakeCy } from './globals.js';
import '../../index.js';

/**
 * Run code of the step definition that matches step text.
 * `cy.then` callbacks are executed synchronously by the fake `cy`.
 * @param {object} world - `this` of the step
 * @param {string} text - step text
 * @param {any[]} args - step arguments
 */
export function runStep(world, text, args) {
    installFakeCy();
    const { stepDefinitions } = globalThis.window.supportCodeLibrary;
    const matches = stepDefinitions.filter(definition => definition.matchesStepName(text));
    if (matches.length !== 1) throw new Error(`expected one definition for '${text}', got ${matches.length}`);
    return matches[0].code.apply(world, args);
}
