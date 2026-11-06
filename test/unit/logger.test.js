import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lazy, logger, configureLogger, maskValue, withRawValue, logElement, logRequest, graphqlOperation, MASK } from '../../lib/logger.js';

test('lazy resolves value once and logs directly', () => {
    const logged = [];
    globalThis.Cypress.log = entry => logged.push(entry.displayName);
    globalThis.cy = { then: () => assert.fail('cy.then must not be used inside lazy resolution') };
    let calls = 0;
    const getter = lazy({ value: () => { calls++; logger.log('$key -> 42'); return 42; } });
    assert.equal(getter(), 42);
    assert.equal(getter(), 42);
    assert.equal(calls, 1);
    assert.deepEqual(logged, ['$key →']);
});

test('lazy retries resolution after error', () => {
    let calls = 0;
    const getter = lazy({ value: () => { if (calls++ === 0) throw new Error('not ready'); return 'ok'; } });
    assert.throws(getter, /not ready/);
    assert.equal(getter(), 'ok');
});

test('logger enqueues entries outside lazy resolution', () => {
    const queued = [];
    globalThis.cy = { then: fn => queued.push(fn) };
    logger.log('$key <- 1');
    assert.equal(queued.length, 1);
});

function captureLogs() {
    const logged = [];
    globalThis.Cypress.log = entry => logged.push(entry);
    globalThis.cy = { then: fn => fn() };
    return logged;
}

test('long messages are truncated, full value is kept in console props', () => {
    configureLogger({ maxLength: 5 });
    const logged = captureLogs();
    logger.log('$key -> 1234567890');
    assert.equal(logged[0].message, '12345…');
    assert.equal(logged[0].consoleProps().Value, '1234567890');
    configureLogger({ maxLength: 0 });
    logger.log('$key -> 1234567890');
    assert.equal(logged[1].message, '1234567890');
    configureLogger();
});

test('masked keys and nested properties are hidden', () => {
    configureLogger({ mask: ['password', /^authorization$/i] });
    const logged = captureLogs();
    logger.log('$userPassword -> secret');
    assert.equal(logged[0].message, MASK);
    assert.equal(logged[0].consoleProps().Value, MASK);
    assert.deepEqual(
        maskValue({ user: 'a', password: 'b', headers: { Authorization: 'c', Accept: 'd' }, list: [{ password: 'e' }] }),
        { user: 'a', password: MASK, headers: { Authorization: MASK, Accept: 'd' }, list: [{ password: MASK }] }
    );
    configureLogger();
});

test('withRawValue logs raw value in console props', () => {
    configureLogger();
    const logged = captureLogs();
    const raw = { a: 1 };
    const result = withRawValue(() => { logger.log('$obj -> {"a":1}'); return raw; }, value => value);
    assert.equal(result, raw);
    assert.equal(logged.length, 1);
    assert.equal(logged[0].consoleProps().Value, raw);
});

test('disabled categories are not logged', () => {
    configureLogger(false);
    const logged = captureLogs();
    logger.log('$key -> 1');
    withRawValue(() => logger.log('$key <- 1'), () => 1);
    logElement('Button', "cy.get('button')", []);
    logRequest({ url: 'http://x' }, { status: 200 });
    assert.equal(logged.length, 0);
    configureLogger({ memory: false });
    logElement('Button', "cy.get('button')", [{ alias: 'Button', selector: 'button' }]);
    assert.equal(logged.length, 1);
    configureLogger();
});

test('invalid mask option throws', () => {
    assert.throws(() => configureLogger({ mask: 'token' }), /log.mask/);
    configureLogger();
});

test('request log contains method, status, GraphQL operation and masked headers', () => {
    configureLogger({ mask: ['authorization'] });
    const logged = captureLogs();
    logRequest(
        { method: 'POST', url: 'http://api/graphql', headers: { Authorization: 'Bearer x' }, body: { query: 'query GetUser { user { id } }' } },
        { status: 200, headers: {}, body: { data: {} } }
    );
    assert.equal(logged[0].message, 'POST 200 http://api/graphql (query GetUser)');
    assert.equal(logged[0].consoleProps().Request.headers.Authorization, MASK);
    configureLogger();
});

test('graphqlOperation detects operation type and name', () => {
    assert.equal(graphqlOperation({ query: 'mutation Add($a: Int) { add }' }), 'mutation Add');
    assert.equal(graphqlOperation({ query: '{ user { id } }' }), 'query');
    assert.equal(graphqlOperation({ query: 'query { a }' }), 'query');
    assert.equal(graphqlOperation(undefined), undefined);
});
