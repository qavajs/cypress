import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
// registers parameter types and steps before lib modules are imported
import { runStep } from './steps.js';
import { assertCondition, getConditionExpect } from '../../lib/conditionExpect.js';
import { MemoryValue } from '../../lib/memoryValue.js';
import { mouseButtons } from '../../lib/types.js';

/**
 * Fake jQuery subject with one element at provided rect inside window of provided size
 */
function element(rect, view = { innerWidth: 1000, innerHeight: 600 }) {
    const el = {
        ownerDocument: { defaultView: view },
        getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, ...rect })
    };
    return { get: () => el };
}

test('inViewport uses size of element window', () => {
    const $el = element({ top: 700, bottom: 750, right: 10 }, { innerWidth: 1000, innerHeight: 800 });
    assert.doesNotThrow(() => assertCondition($el, getConditionExpect('to be in viewport')));
    assert.throws(() => assertCondition($el, getConditionExpect('not to be in viewport')), /not to be in viewport/);
});

test('inViewport fails for element outside of window', () => {
    const $el = element({ top: 700, bottom: 750, right: 10 }, { innerWidth: 1000, innerHeight: 600 });
    assert.throws(() => assertCondition($el, 'inViewport'), /to be in viewport/);
    assert.doesNotThrow(() => assertCondition($el, 'not.inViewport'));
});

test('mouse buttons map to MouseEvent button and buttons values', () => {
    assert.deepEqual(mouseButtons.left, { button: 0, buttons: 1 });
    assert.deepEqual(mouseButtons.middle, { button: 1, buttons: 4 });
    assert.deepEqual(mouseButtons.right, { button: 2, buttons: 2 });
});

test('every element in array step fails for non array', () => {
    const world = { value: v => (v === '$notArray' ? 42 : v) };
    assert.throws(
        () => runStep(world, 'I expect every element in \'$notArray\' array to equal \'1\'', [
            new MemoryValue(world, '$notArray'),
            () => {},
            new MemoryValue(world, '1')
        ]),
        /'\$notArray' is not an array/
    );
});
