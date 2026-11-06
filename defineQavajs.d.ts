/** Options controlling qavajs entries in the Cypress command log. */
export interface QavajsLogOptions {
    /** Log memory reads (`$key →`) and writes (`$key ←`). Default `true`. */
    memory?: boolean;
    /** Log page object element resolution. Default `true`. */
    elements?: boolean;
    /** Log HTTP requests sent by `I send ... request` step. Default `true`. */
    requests?: boolean;
    /** Max length of a command log message; full value stays in DevTools console. `0` disables truncation. Default `200`. */
    maxLength?: number;
    /**
     * Patterns of memory keys and object property names (e.g. headers) whose values are replaced with `***`.
     * String matches case-insensitive substring.
     */
    mask?: Array<string | RegExp>;
}

/** Options passed to {@link defineQavajs} to wire up the qavajs runtime. */
export interface QavajsOptions {
    /** Root page-object instance or class used to resolve element aliases. */
    pageObject: object | (new () => object);
    /** Object whose properties are registered as memory values and functions. */
    memory?: Record<string, any>;
    /** Command log options. `false` disables all qavajs log entries. */
    log?: false | QavajsLogOptions;
}

/**
 * Initialise the qavajs runtime with page object and memory.
 * Call this once in your Cypress support file, in the same bundle that imports `@qavajs/cypress`.
 *
 * @param options - Page-object and memory configuration.
 *
 * @example
 * ```ts
 * import defineQavajs from '@qavajs/cypress/defineQavajs';
 * import '@qavajs/cypress';
 * import App from './page_object';
 * import Memory from './memory';
 *
 * defineQavajs({ pageObject: new App(), memory: new Memory() });
 * ```
 */
export declare function defineQavajs(options: QavajsOptions): void;

export default defineQavajs;
