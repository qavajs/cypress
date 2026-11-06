/**
 * Registers all qavajs Cucumber step definitions (actions, validations, memory, HTTP, mouse, storage, etc.)
 * with the `@qavajs/cypress-runner-adapter` runtime and exports types for writing custom steps.
 *
 * Import this once in your Cypress support file:
 * ```ts
 * import '@qavajs/cypress';
 * ```
 *
 * @example custom step
 * ```ts
 * import { When } from '@qavajs/cypress-runner-adapter';
 * import type { QavajsCypressWorld, MemoryValue } from '@qavajs/cypress';
 *
 * When('I type {value} slowly into {locator}', function (
 *     this: QavajsCypressWorld,
 *     text: MemoryValue,
 *     locator: Cypress.Chainable<JQuery<HTMLElement>>
 * ) {
 *     locator.then($el => cy.wrap($el).type(text.value(), { delay: 200 }));
 * });
 * ```
 */
import { World, WorldOptions } from '@qavajs/cypress-runner-adapter';

/** Memory instance used to resolve and store values. */
export interface QavajsMemory {
    /** Resolve memory expression, e.g. `'$key'` or `'$js(1 + 1)'`. */
    getValue(expression: any): any;
    /** Save value under provided key. */
    setValue(key: string, value: any): void;
    /** Register object whose properties become memory constants/functions. */
    register(obj: Record<string, any>): void;
}

/** Value of `{value}` step parameter: an unresolved memory expression. */
export declare class MemoryValue {
    readonly world: QavajsCypressWorld;
    /** Raw expression from the step text. */
    readonly expression: string;
    constructor(world: QavajsCypressWorld, expression: string);
    /**
     * Resolve the expression. Resolution is synchronous, so call it inside a Cypress command
     * callback (e.g. `cy.then`) to get values saved by previous steps.
     */
    value<T = any>(): T;
    /** Save value to memory using the expression as key. */
    set(value: any): void;
    toString(): string;
}

/** A recorded call of an interception or mock. */
export interface InterceptionCall {
    request: { url: string; method: string; headers: Record<string, string | string[]>; body: any };
    /** `undefined` until the response is received */
    response?: { statusCode?: number; statusMessage?: string; headers?: Record<string, string | string[]>; body?: any; error?: string };
    /** `true` when the call was returned by `I wait for result of ... interception` */
    waited: boolean;
}

/** Interception or mock created by `I create interception/mock for ... as ...` and saved to memory. */
export declare class Interception {
    /** Memory key the interception is saved as. */
    readonly name: string;
    /** `cy.intercept` url glob, RegExp or RouteMatcher. */
    readonly matcher: string | RegExp | object;
    /** All recorded calls. */
    calls: InterceptionCall[];
    /** Last call returned by `I wait for result of ... interception`. */
    result?: InterceptionCall;
    /** Mocked response passed to `req.reply`. */
    mock?: { statusCode: number; body?: any; headers?: Record<string, string> } | { forceNetworkError: true };
    /** `false` after `I restore ... mock`. */
    active: boolean;
    constructor(name: string, matcher: string | RegExp | object);
    /** Oldest completed call that was not waited yet. */
    nextCall(): InterceptionCall | undefined;
}

/** World (`this`) of qavajs steps. */
export declare class QavajsCypressWorld extends World {
    memory: QavajsMemory;
    /** Page object passed to `defineQavajs`. */
    pageObject: object | (new () => object);
    cy: Cypress.cy & CyEventEmitter;
    frame: Cypress.cy & CyEventEmitter;
    constructor(options: WorldOptions);
    /**
     * Resolve page object path (e.g. `'Form > Submit Button'`) to element chain.
     * @param path - page object path
     */
    element(path: string): Cypress.Chainable<JQuery<HTMLElement>>;
    /** Resolve memory expression. */
    value(expression: string): any;
    /** Save value to memory. */
    setValue(key: string, value: any): void;
    /** Log message to Cypress command log and attach it to the test report. */
    log(value: string): void;
}
