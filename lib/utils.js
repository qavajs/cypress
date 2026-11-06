/**
 * Parse 'x, y' string to coordinates array
 * @param {string} coords - 'x, y' string
 * @return {number[]} - coords array
 */
export function parseCoords(coords) {
    const parsed = String(coords).split(/\s*,\s*/).map(c => (c === '' ? 0 : parseFloat(c)));
    const invalid = parsed.findIndex(c => Number.isNaN(c));
    if (invalid !== -1) {
        throw new Error(`'${coords}' is not a valid 'x, y' coordinates string`);
    }
    return parsed;
}

/**
 * Transform key-value data table to JS object
 * @param ctx
 * @param dataTable
 * @return {Object}
 */
export function dataTable2Object(ctx, dataTable) {
    const obj = {};
    for (const [key, value] of dataTable.raw()) {
        obj[key] = ctx.value(value);
    }
    return obj;
}

/**
 * Transform key-value data table to array
 * @param ctx
 * @param dataTable
 * @return {any[]}
 */
export function dataTable2Array(ctx, dataTable) {
    return dataTable.raw().map(([value]) => ctx.value(value));
}

/**
 * Split memory log entry ('key -> value' or 'key <- value') into Cypress log parts.
 * Only the first arrow is treated as a divider, so values containing arrows are kept intact.
 * @param {string} entry - memory log entry
 * @return {{ displayName: string, key: string, message: string }}
 */
export function formatLog(entry) {
    const text = String(entry);
    const match = /^(.*?)\s(->|<-)\s([\s\S]*)$/.exec(text);
    if (!match) {
        return { displayName: 'log', key: 'log', message: text };
    }
    const [, key, divider, message] = match;
    return { displayName: `${key} ${divider === '->' ? '→' : '←'}`, key, message };
}

/**
 * Build key that identifies the running scenario from mocha title path.
 * In `describe` mode the scenario is a suite and each step is a test, in `it` mode the scenario is a test,
 * so the path is cut right after the 'Scenario: ...' title.
 * @param {string[]} titlePath - Cypress.currentTest.titlePath
 * @return {string}
 */
export function scenarioKey(titlePath = []) {
    const index = titlePath.findIndex(title => title.startsWith('Scenario'));
    return (index === -1 ? titlePath : titlePath.slice(0, index + 1)).join(' > ');
}
