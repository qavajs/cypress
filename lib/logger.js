import { formatLog } from './utils.js';

export const MASK = '***';
const MAX_MASK_DEPTH = 10;

const DEFAULT_LOG_OPTIONS = Object.freeze({
    memory: true,
    elements: true,
    requests: true,
    maxLength: 200,
    mask: []
});

let options = DEFAULT_LOG_OPTIONS;
let direct = false;
let capture = null;

/**
 * Configure qavajs logging. `false` disables all qavajs log entries.
 * @param {false | { memory?: boolean, elements?: boolean, requests?: boolean, maxLength?: number, mask?: Array<string | RegExp> }} [logOptions]
 */
export function configureLogger(logOptions) {
    if (logOptions === false) {
        options = { ...DEFAULT_LOG_OPTIONS, memory: false, elements: false, requests: false };
        return;
    }
    const mask = logOptions?.mask ?? [];
    if (!Array.isArray(mask) || mask.some(pattern => typeof pattern !== 'string' && !(pattern instanceof RegExp))) {
        throw new Error('defineQavajs: `log.mask` must be an array of strings or regular expressions');
    }
    options = { ...DEFAULT_LOG_OPTIONS, ...logOptions, mask };
}

/**
 * Get current logging options
 */
export function getLogOptions() {
    return options;
}

/**
 * Check if key matches one of `log.mask` patterns.
 * String pattern matches case-insensitive substring, RegExp is tested against the key.
 * @param {string} key
 * @return {boolean}
 */
export function isMasked(key) {
    const text = String(key);
    return options.mask.some(pattern => typeof pattern === 'string'
        ? text.toLowerCase().includes(pattern.toLowerCase())
        : new RegExp(pattern.source, pattern.flags.replace('g', '')).test(text)
    );
}

function isPlainObject(value) {
    if (value === null || typeof value !== 'object') return false;
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

/**
 * Copy value replacing properties whose names match `log.mask` patterns.
 * Only arrays and plain objects are traversed, other values (DOM, jQuery, class instances) are returned as is.
 * @param {any} value
 * @param {number} [depth]
 * @return {any}
 */
export function maskValue(value, depth = 0) {
    if (!options.mask.length || depth > MAX_MASK_DEPTH) return value;
    if (Array.isArray(value)) return value.map(item => maskValue(item, depth + 1));
    if (!isPlainObject(value)) return value;
    const result = {};
    for (const [key, item] of Object.entries(value)) {
        result[key] = isMasked(key) ? MASK : maskValue(item, depth + 1);
    }
    return result;
}

/**
 * Shorten text to `log.maxLength` characters. `0` or negative value disables truncation.
 * @param {string} text
 * @return {string}
 */
export function truncate(text) {
    const max = options.maxLength;
    const str = String(text);
    return max > 0 && str.length > max ? `${str.slice(0, max)}…` : str;
}

/**
 * Write entry to Cypress command log, enqueued with cy.then unless direct logging is active
 * @param {object} entry - Cypress.log options
 */
function emit(entry) {
    if (direct) {
        Cypress.log(entry);
    } else {
        cy.then(() => { Cypress.log(entry); });
    }
}

function writeMemory({ displayName, key, message }, raw, hasRaw) {
    const masked = isMasked(key);
    const value = masked ? MASK : hasRaw ? maskValue(raw) : message;
    emit({
        name: 'memory',
        displayName,
        message: masked ? MASK : truncate(message),
        alias: key,
        consoleProps: () => ({
            Key: key,
            Value: value,
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
        if (capture) {
            capture.push(value);
            return;
        }
        if (!options.memory) return;
        writeMemory(formatLog(value));
    }
};

/**
 * Run memory operation and log its entries with the raw (not stringified) value
 * @param {Function} fn - memory operation that writes log entries via `logger.log`
 * @param {(result: any) => any} getRaw - get raw value from operation result
 * @return {any} operation result
 */
export function withRawValue(fn, getRaw) {
    const previous = capture;
    const entries = capture = [];
    let result;
    try {
        result = fn();
    } finally {
        capture = previous;
    }
    if (options.memory) {
        const raw = getRaw(result);
        // only the last entry belongs to the operation, nested ones (if any) are written as text
        entries.forEach((entry, index) => writeMemory(formatLog(entry), raw, index === entries.length - 1));
    }
    return result;
}

/**
 * Write page object element log entry
 * @param {string} path - page object path
 * @param {string} chain - resolved cy chain, e.g. cy.get('#a').find('.b')
 * @param {Array<{ alias: string, selector: any, argument?: string }>} items - chain items
 */
export function logElement(path, chain, items) {
    if (!options.elements) return;
    Cypress.log({
        name: 'element',
        displayName: `${path} →`,
        message: truncate(chain),
        type: 'parent',
        consoleProps: () => ({
            Key: path,
            Element: chain,
            Chain: items.map(({ alias, selector, argument }) => ({
                alias,
                selector: typeof selector === 'function' ? '[function]' : selector,
                argument
            }))
        }),
        alias: path,
        aliasType: 'dom'
    });
}

/**
 * Get GraphQL operation name from request body
 * @param {any} body
 * @return {string | undefined}
 */
export function graphqlOperation(body) {
    const query = body?.query;
    if (typeof query !== 'string') return undefined;
    const match = /^\s*(query|mutation|subscription)\b\s*(\w+)?/.exec(query);
    if (match) return match[2] ? `${match[1]} ${match[2]}` : match[1];
    return /^\s*{/.test(query) ? 'query' : undefined;
}

/**
 * Write HTTP request log entry with masked request and response
 * @param {object} request - cy.request options
 * @param {Cypress.Response<any>} response
 */
export function logRequest(request, response) {
    if (!options.requests) return;
    const method = request.method ?? 'GET';
    const operation = graphqlOperation(request.body);
    const target = operation ? `${request.url} (${operation})` : request.url;
    Cypress.log({
        name: 'request',
        displayName: 'request',
        message: truncate(`${method} ${response.status} ${target}`),
        consoleProps: () => ({
            Request: maskValue({
                method,
                url: request.url,
                headers: request.headers,
                qs: request.qs,
                body: request.body
            }),
            Response: maskValue({
                status: response.status,
                statusText: response.statusText,
                duration: response.duration,
                headers: response.headers,
                body: response.body
            })
        })
    });
}

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
