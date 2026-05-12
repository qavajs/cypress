/** Options passed to {@link defineQavajs} to wire up the qavajs runtime. */
export interface QavajsOptions {
    /** Root page-object instance or class used to resolve element aliases. */
    pageObject: object;
    /** Memory instance used for expression interpolation and value storage. */
    memory: object;
}

/**
 * Initialise the qavajs runtime by attaching the page-object and memory
 * instances to the Cypress `window` object so step definitions can access them.
 * Call this once in your Cypress support file before any tests run.
 *
 * @param options - Page-object and memory configuration.
 *
 * @example
 * ```ts
 * import defineQavajs from '@qavajs/cypress/defineQavajs';
 * import App from './page_object';
 * import Memory from './memory';
 *
 * defineQavajs({ pageObject: new App(), memory: new Memory() });
 * ```
 */
export declare function defineQavajs(options: QavajsOptions): void;

export default defineQavajs;
