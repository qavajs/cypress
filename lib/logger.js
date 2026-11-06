import { formatLog } from './utils.js';

let direct = false;

function write(entry) {
    Cypress.log({
        displayName: entry.displayName,
        message: entry.message,
        alias: entry.key,
        consoleProps: () => ({
            Key: entry.key,
            Value: entry.message,
        })
    });
}

/**
 * Memory logger.
 * By default the entry is enqueued with cy.then to keep command log order when called from a step body.
 * Inside retryable callbacks (should, filter) commands are not allowed, so entries are written directly.
 */
export const logger = {
    log(value) {
        const entry = formatLog(value);
        if (direct) {
            write(entry);
        } else {
            cy.then(() => write(entry));
        }
    }
};

/**
 * Run function so that memory log entries are written directly instead of being enqueued
 * @param {Function} fn
 */
export function withDirectLog(fn) {
    const previous = direct;
    direct = true;
    try {
        return fn();
    } finally {
        direct = previous;
    }
}

/**
 * Create getter that resolves memory value once, on first call.
 * Safe to call inside retryable callbacks such as `should` or `filter`,
 * so values saved by previous steps are resolved at command execution time.
 * @param {import('./memoryValue.js').MemoryValue} memoryValue
 * @return {() => any}
 */
export function lazy(memoryValue) {
    let resolved = false;
    let value;
    return () => {
        if (!resolved) {
            value = withDirectLog(() => memoryValue.value());
            resolved = true;
        }
        return value;
    };
}
