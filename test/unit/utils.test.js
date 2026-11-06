import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCoords, formatLog, scenarioKey, dataTable2Object, dataTable2Array } from '../../lib/utils.js';
import { MemoryValue } from '../../lib/memoryValue.js';

test('parseCoords parses x, y string', () => {
    assert.deepEqual(parseCoords('10, 20'), [10, 20]);
    assert.deepEqual(parseCoords('1.5,-2'), [1.5, -2]);
    assert.deepEqual(parseCoords('10,'), [10, 0]);
});

test('parseCoords throws on invalid coordinates', () => {
    assert.throws(() => parseCoords('a, 1'), /is not a valid 'x, y' coordinates string/);
});

test('formatLog splits only on first arrow', () => {
    assert.deepEqual(formatLog('$key -> a -> b'), { displayName: '$key →', key: '$key', message: 'a -> b' });
    assert.deepEqual(formatLog('$key <- value'), { displayName: '$key ←', key: '$key', message: 'value' });
});

test('formatLog keeps plain messages', () => {
    assert.deepEqual(formatLog('hello world'), { displayName: 'log', key: 'log', message: 'hello world' });
});

test('scenarioKey cuts path after scenario title', () => {
    assert.equal(scenarioKey(['Feature', 'Scenario: a', 'When I click']), 'Feature > Scenario: a');
    assert.equal(scenarioKey(['Feature', 'Scenario: a']), 'Feature > Scenario: a');
    assert.equal(scenarioKey(['Other']), 'Other');
    assert.equal(scenarioKey(undefined), '');
});

test('data tables are resolved through world', () => {
    const world = { value: v => v.toUpperCase() };
    const table = { raw: () => [['a', 'x'], ['b', 'y']] };
    assert.deepEqual(dataTable2Object(world, table), { a: 'X', b: 'Y' });
    assert.deepEqual(dataTable2Array(world, table), ['A', 'B']);
});

test('MemoryValue resolves and sets via world', () => {
    const store = {};
    const world = { value: e => `resolved ${e}`, setValue: (k, v) => { store[k] = v; } };
    const value = new MemoryValue(world, '$key');
    assert.equal(value.value(), 'resolved $key');
    value.set(42);
    assert.deepEqual(store, { $key: 42 });
    assert.equal(`${value}`, '$key');
});
