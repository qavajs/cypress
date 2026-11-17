import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
// registers parameter types and steps before lib modules are imported
import { runStep } from './steps.js';
import { GraphQl, toFormData, toCypressRequest } from '../../lib/http.js';
import { MemoryValue } from '../../lib/memoryValue.js';

const world = { value: v => v };

test('GraphQl stores query and variables in body', () => {
    const request = new GraphQl();
    request.query = 'query { users { name } }';
    request.variables = '{"page": 2}';
    assert.deepEqual(request.body, { query: 'query { users { name } }', variables: { page: 2 } });
    assert.equal(request.query, 'query { users { name } }');
    assert.deepEqual(request.variables, { page: 2 });
});

test('GraphQl accepts variables object', () => {
    const request = new GraphQl();
    request.variables = { page: 3 };
    assert.deepEqual(request.body.variables, { page: 3 });
});

test('GraphQl request is spread to cy.request options with body', () => {
    const request = new GraphQl();
    request.url = 'https://example.com/graphql';
    request.query = 'query { a }';
    const options = { ...request };
    assert.deepEqual(Object.keys(options).sort(), ['body', 'headers', 'method', 'url']);
    assert.equal(options.body.query, 'query { a }');
});

test('form data rows without filename are plain fields', async () => {
    const formData = toFormData(world, [
        { key: 'name', value: 'qavajs', filename: '', contentType: '' },
        { key: 'file', value: 'content', filename: 'file.txt', contentType: 'text/plain' }
    ]);
    assert.equal(formData.get('name'), 'qavajs');
    const file = formData.get('file');
    assert.ok(file instanceof Blob);
    assert.equal(file.name, 'file.txt');
    assert.equal(file.type, 'text/plain');
    assert.equal(await file.text(), 'content');
});

test('form data body is encoded to multipart string with boundary', async () => {
    const formData = toFormData(world, [{ key: 'name', value: 'qavajs' }]);
    const options = await toCypressRequest({
        method: 'POST',
        headers: { 'content-type': 'application/json', 'X-Test': '1' },
        body: formData
    });
    assert.match(options.headers['Content-Type'], /^multipart\/form-data; boundary=/);
    assert.equal(options.headers['content-type'], undefined);
    assert.equal(options.headers['X-Test'], '1');
    assert.equal(typeof options.body, 'string');
    assert.match(options.body, /name="name"\r\n\r\nqavajs/);
});

test('non form data request is passed as is', () => {
    const request = { method: 'GET', body: { a: 1 } };
    assert.deepEqual(toCypressRequest(request), request);
});

test('add body steps set body of request', () => {
    const request = { method: 'POST' };
    const memoryWorld = { value: expression => (expression === '$request' ? request : expression) };
    runStep(memoryWorld, 'I add body to \'$request\':', [new MemoryValue(memoryWorld, '$request'), '{"a":1}']);
    assert.equal(request.body, '{"a":1}');
    assert.equal(request.data, undefined);
});
