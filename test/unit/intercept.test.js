import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import '../../lib/types.js';
import { Interception, mockBody, statusCode } from '../../lib/intercept.js';

function fakeRequest() {
    const req = {
        url: 'http://localhost/api/users',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: { name: 'John' },
        replies: [],
        handlers: {},
        reply(response) { this.replies.push(response); },
        on(event, handler) { this.handlers[event] = handler; }
    };
    return req;
}

test('interception records request and response of passed through call', () => {
    const interception = new Interception('users', '**/api/users');
    const req = fakeRequest();
    interception.handle(req);
    assert.equal(interception.nextCall(), undefined, 'call without response is not completed');
    req.handlers.response({ statusCode: 201, statusMessage: 'Created', headers: {}, body: { id: 1 } });
    const call = interception.nextCall();
    assert.deepEqual(call.request.body, { name: 'John' });
    assert.equal(call.response.statusCode, 201);
    assert.deepEqual(req.replies, []);
});

test('mock replies and records mocked response', () => {
    const interception = new Interception('users', '**/api/users');
    interception.mock = { statusCode: 500, body: '' };
    const req = fakeRequest();
    interception.handle(req);
    assert.deepEqual(req.replies, [{ statusCode: 500, body: '' }]);
    assert.equal(interception.nextCall().response.statusCode, 500);
});

test('aborted mock forces network error', () => {
    const interception = new Interception('users', '**/api/users');
    interception.mock = { forceNetworkError: true };
    const req = fakeRequest();
    interception.handle(req);
    assert.deepEqual(req.replies, [{ forceNetworkError: true }]);
    assert.equal(interception.nextCall().response.error, 'network error');
});

test('waited calls are skipped by nextCall', () => {
    const interception = new Interception('users', '**/api/users');
    interception.mock = { statusCode: 200, body: 'first' };
    interception.handle(fakeRequest());
    interception.mock = { statusCode: 200, body: 'second' };
    interception.handle(fakeRequest());
    interception.nextCall().waited = true;
    assert.equal(interception.nextCall().response.body, 'second');
});

test('restored interception does not record or reply', () => {
    const interception = new Interception('users', '**/api/users');
    interception.active = false;
    const req = fakeRequest();
    interception.handle(req);
    assert.equal(interception.calls.length, 0);
    assert.deepEqual(req.replies, []);
    assert.deepEqual(req.handlers, {});
});

test('mock body parses JSON strings only', () => {
    assert.deepEqual(mockBody('[{"name":"a"}]'), [{ name: 'a' }]);
    assert.equal(mockBody('plain text'), 'plain text');
    assert.deepEqual(mockBody({ a: 1 }), { a: 1 });
});

test('status code is validated', () => {
    assert.equal(statusCode('404'), 404);
    assert.throws(() => statusCode('abc'), /'abc' is not a valid HTTP status code/);
    assert.throws(() => statusCode('99'), /not a valid HTTP status code/);
});
