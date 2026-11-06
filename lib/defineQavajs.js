import { configureLogger } from './logger.js';

let qavajsOptions;

/**
 * Configure qavajs runtime
 * @param {{ pageObject: object | Function, memory?: object, log?: false | object }} options
 */
export function defineQavajs(options) {
    if (!options?.pageObject) {
        throw new Error('defineQavajs: `pageObject` option is required');
    }
    configureLogger(options.log);
    qavajsOptions = options;
}

/**
 * Get options passed to defineQavajs
 * @return {{ pageObject: object | Function, memory?: object }}
 */
export function getQavajsOptions() {
    if (!qavajsOptions) {
        throw new Error(
            'qavajs is not configured: call defineQavajs({ pageObject, memory }) in the Cypress support file ' +
            'and import it from the same bundle as \'@qavajs/cypress\''
        );
    }
    return qavajsOptions;
}
