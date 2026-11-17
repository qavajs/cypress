import { installFakeCy } from './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStorage, scenarioMemory } from '../../lib/scenarioMemory.js';

class Memory {
    baseUrl = 'https://example.com';
    list = [1, 2];
    upper(value) {
        return value.toUpperCase();
    }
}

test('class is instantiated for every storage', () => {
    const first = createStorage(Memory);
    const second = createStorage(Memory);
    assert.notEqual(first, second);
    assert.notEqual(first.list, second.list);
    assert.equal(first.upper('a'), 'A');
});

test('instance is copied with its prototype', () => {
    const instance = new Memory();
    const storage = createStorage(instance);
    assert.notEqual(storage, instance);
    assert.equal(storage.baseUrl, 'https://example.com');
    assert.equal(storage.upper('a'), 'A');
    storage.saved = 'value';
    assert.equal(instance.saved, undefined);
});

test('empty storage is created without memory option', () => {
    assert.deepEqual(createStorage(undefined), {});
});

test('storage is registered once per world', () => {
    installFakeCy();
    const firstWorld = {};
    const secondWorld = {};
    const memory = scenarioMemory(firstWorld, Memory);
    memory.setValue('saved', 'first');
    assert.equal(scenarioMemory(firstWorld, Memory).getValue('$saved'), 'first');
    assert.equal(scenarioMemory(secondWorld, Memory).getValue('$saved'), undefined);
    assert.equal(scenarioMemory(secondWorld, Memory).getValue('$baseUrl'), 'https://example.com');
});
