import { When } from '@qavajs/cypress-runner-adapter';
import { scenarioKey } from './utils.js';

/**
 * Network interception (cy.intercept) of the running scenario.
 * Cypress removes routes before every test, and in `describe` mode every step is a test,
 * so routes created by the scenario are registered again before each test.
 * Calls are recorded in the Interception object, so they survive the boundary between step tests.
 */
export class Interception {
    /**
     * @param {string} name - memory key the interception is saved as
     * @param {string | RegExp | object} matcher - cy.intercept url or RouteMatcher
     */
    constructor(name, matcher) {
        this.name = name;
        this.matcher = matcher;
        /** @type {Array<{ request: object, response?: object, waited: boolean }>} */
        this.calls = [];
        /** last call returned by `I wait for result of ... interception` */
        this.result = undefined;
        /** mocked response: { statusCode, body } or { forceNetworkError: true } */
        this.mock = undefined;
        this.active = true;
    }

    /**
     * cy.intercept route handler
     * @param {object} req - Cypress intercepted request
     */
    handle(req) {
        if (!this.active) return;
        const call = {
            request: { url: req.url, method: req.method, headers: req.headers, body: req.body },
            response: undefined,
            waited: false
        };
        this.calls.push(call);
        if (this.mock) {
            req.reply(this.mock);
            call.response = this.mock.forceNetworkError
                ? { error: 'network error' }
                : { statusCode: this.mock.statusCode, headers: this.mock.headers ?? {}, body: this.mock.body };
            return;
        }
        req.on('response', res => {
            call.response = {
                statusCode: res.statusCode,
                statusMessage: res.statusMessage,
                headers: res.headers,
                body: res.body
            };
        });
    }

    /**
     * Oldest completed call that was not returned by a previous wait
     */
    nextCall() {
        return this.calls.find(call => !call.waited && call.response);
    }

    toString() {
        return `Interception(${this.name}): ${this.calls.length} call(s)`;
    }
}

const state = {
    scenario: undefined,
    interceptions: []
};

/**
 * Interceptions created by the running scenario
 * @return {Interception[]}
 */
export function interceptions() {
    const key = scenarioKey(Cypress.currentTest?.titlePath);
    if (state.scenario !== key) {
        state.scenario = key;
        state.interceptions = [];
    }
    return state.interceptions;
}

function register(interception) {
    cy.intercept(interception.matcher, req => interception.handle(req));
}

// routes are removed by Cypress before every test, restore routes of the running scenario
beforeEach(() => {
    for (const interception of interceptions()) {
        if (interception.active) register(interception);
    }
});

/**
 * Create interception and save it to memory
 * @param {import('./memoryValue.js').MemoryValue} matcher
 * @param {import('./memoryValue.js').MemoryValue} key
 */
function createInterception(matcher, key) {
    cy.then(() => {
        const interception = new Interception(String(key), matcher.value());
        interceptions().push(interception);
        register(interception);
        key.set(interception);
    });
}

/**
 * Resolve interception from memory
 * @param {import('./memoryValue.js').MemoryValue} memoryValue
 * @return {Interception}
 */
function getInterception(memoryValue) {
    const interception = memoryValue.value();
    if (!(interception instanceof Interception)) {
        throw new Error(
            `'${memoryValue}' is not an interception. ` +
            `Create it with: I create interception for '<url>' as '<name>' (or I create mock for ...)`
        );
    }
    return interception;
}

/**
 * Convert mock body: JSON strings are parsed, other values are kept as is
 * @param {any} body
 * @return {any}
 */
export function mockBody(body) {
    if (typeof body !== 'string') return body;
    try {
        return JSON.parse(body);
    } catch {
        return body;
    }
}

/**
 * Parse mock status code
 * @param {any} status
 * @return {number}
 */
export function statusCode(status) {
    const code = Number(status);
    if (!Number.isInteger(code) || code < 100 || code > 599) {
        throw new Error(`'${status}' is not a valid HTTP status code`);
    }
    return code;
}

/**
 * Wait for next completed call of interception
 * @param {import('./memoryValue.js').MemoryValue} interceptionKey
 * @param {import('./memoryValue.js').MemoryValue} [resultKey]
 */
function waitForResult(interceptionKey, resultKey) {
    cy.then(() => {
        const interception = getInterception(interceptionKey);
        cy.wrap(null, { log: false, timeout: Cypress.config('responseTimeout') })
            .should(() => {
                expect(interception.nextCall(), `result of '${interception.name}' interception`).to.exist;
            })
            .then(() => {
                const call = interception.nextCall();
                call.waited = true;
                interception.result = call;
                Cypress.log({
                    name: 'interception',
                    message: `${interception.name}: ${call.request.method} ${call.request.url} → ${call.response.statusCode ?? call.response.error}`,
                    consoleProps: () => ({ Request: call.request, Response: call.response })
                });
                if (resultKey) resultKey.set(call);
            });
    });
}

/**
 * Create interception of network requests.
 * Calls of interception are available as `$name.calls`, the last waited result as `$name.result`.
 * @param {string} matcher - url glob, RegExp or cy.intercept RouteMatcher object
 * @param {string} key - memory key to save interception
 * @example I create interception for '**\/api/users' as 'users'
 * @example I create interception for '$usersMatcher' as 'users'
 */
When('I create interception for {value} as {value}', function (matcher, key) {
    createInterception(matcher, key);
});

/**
 * Create mock of network requests. Requests pass through until a response is set.
 * Mock is an interception, so all interception steps can be used with it.
 * @param {string} matcher - url glob, RegExp or cy.intercept RouteMatcher object
 * @param {string} key - memory key to save mock
 * @example I create mock for '**\/api/users' as 'usersMock'
 */
When('I create mock for {value} as {value}', function (matcher, key) {
    createInterception(matcher, key);
});

/**
 * Wait until interception receives a response.
 * Every wait returns the next call, so a scenario can wait for several requests one by one.
 * Waits up to `responseTimeout`.
 * @param {string} interception - interception
 * @example I wait for result of '$users' interception
 */
When('I wait for result of {value} interception', function (interception) {
    waitForResult(interception);
});

/**
 * Wait until interception receives a response and save the call ({ request, response }) to memory
 * @param {string} interception - interception
 * @param {string} key - memory key to save the call
 * @example
 * When I wait for result of '$users' interception and save it as 'usersCall'
 * Then I expect '$usersCall.response.statusCode' to equal '200'
 */
When('I wait for result of {value} interception and save it as {value}', function (interception, key) {
    waitForResult(interception, key);
});

/**
 * Respond to requests matched by mock with status and body from docstring (JSON is parsed)
 * @param {string} mock - mock
 * @param {string} status - status code
 * @param {string} body - response body
 * @example
 * When I set '$usersMock' mock to respond '200' with:
 * """
 * [{ "name": "Mock 1" }]
 * """
 */
When('I set {value} mock to respond {value} with:', function (mock, status, body) {
    cy.then(() => {
        getInterception(mock).mock = { statusCode: statusCode(status.value()), body: mockBody(this.value(body)) };
    });
});

/**
 * Respond to requests matched by mock with status and body from memory
 * @param {string} mock - mock
 * @param {string} status - status code
 * @param {string} body - response body
 * @example I set '$usersMock' mock to respond '200' with '$users'
 */
When('I set {value} mock to respond {value} with {value}', function (mock, status, body) {
    cy.then(() => {
        getInterception(mock).mock = { statusCode: statusCode(status.value()), body: mockBody(body.value()) };
    });
});

/**
 * Respond to requests matched by mock with status and empty body
 * @param {string} mock - mock
 * @param {string} status - status code
 * @example I set '$usersMock' mock to respond '500'
 */
When('I set {value} mock to respond {value}', function (mock, status) {
    cy.then(() => {
        getInterception(mock).mock = { statusCode: statusCode(status.value()), body: '' };
    });
});

/**
 * Fail requests matched by mock with network error
 * @param {string} mock - mock
 * @example I set '$usersMock' mock to abort
 */
When('I set {value} mock to abort', function (mock) {
    cy.then(() => {
        getInterception(mock).mock = { forceNetworkError: true };
    });
});

/**
 * Stop mocking and intercepting requests
 * @param {string} mock - mock or interception
 * @example I restore '$usersMock' mock
 */
When('I restore {value} mock', function (mock) {
    cy.then(() => {
        const interception = getInterception(mock);
        interception.mock = undefined;
        interception.active = false;
    });
});

/**
 * Stop all mocks and interceptions of the scenario
 * @example I restore all mocks
 */
When('I restore all mocks', function () {
    cy.then(() => {
        for (const interception of interceptions()) {
            interception.mock = undefined;
            interception.active = false;
        }
    });
});
