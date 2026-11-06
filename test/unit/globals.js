// Browser globals required by lib modules at import time.
// Imported first by every unit test, so it is evaluated before lib modules.
import * as chai from 'chai';

globalThis.chai = chai;
globalThis.expect = chai.expect;
globalThis.Cypress = {
    log() {},
    config: key => ({ viewportWidth: 1000, viewportHeight: 600 })[key]
};

/**
 * Minimal fake of `cy` that records commands of element chains
 * @return {{ calls: string[] }} - recorded commands, e.g. `get(#a)`, `find(.b)`
 */
export function installFakeCy() {
    const calls = [];
    const chain = {
        get: selector => { calls.push(`get(${selector})`); return chain; },
        find: selector => { calls.push(`find(${selector})`); return chain; },
        then: fn => fn()
    };
    globalThis.cy = chain;
    return { calls, chain };
}
