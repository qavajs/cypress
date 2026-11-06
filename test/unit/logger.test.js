import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lazy, logger } from '../../lib/logger.js';

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
