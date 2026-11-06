/** Options passed to {@link defineQavajs} to wire up the qavajs runtime. */
export interface QavajsOptions {
    /** Root page-object instance or class used to resolve element aliases. */
    pageObject: object | (new () => object);
    /** Object whose properties are registered as memory values and functions. */
    memory?: Record<string, any>;
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
