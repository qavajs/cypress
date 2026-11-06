import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getValidation, validationRegexp, validations } from '../../lib/valueExpect.js';
import { getConditionExpect, conditionWaitRegexp } from '../../lib/conditionExpect.js';

const fullMatch = (regexp, text) => new RegExp(`^${regexp.source}$`).test(text);

test('every validation phrase matched by parameter regexp is supported', () => {
    const phrases = [];
    for (const validation of Object.values(validations)) {
        for (const prefix of ['to ', 'to be ', 'not to ', 'to not be ', 'is ', 'does not ']) {
            phrases.push(prefix + validation);
        }
    }
    phrases.push('to include members', 'to have members', 'equals', 'matches', 'contains');
    for (const phrase of phrases) {
        assert.ok(fullMatch(validationRegexp, phrase), `regexp should match '${phrase}'`);
        assert.doesNotThrow(() => getValidation(phrase), `'${phrase}' should be supported`);
    }
});

test('unsupported validation throws', () => {
    assert.throws(() => getValidation('to softly equal'), /validation 'to softly equal' is not supported/);
    assert.ok(!fullMatch(validationRegexp, 'to softly equal'));
    assert.ok(!fullMatch(validationRegexp, 'to match schema'));
});

test('validations assert values', () => {
    getValidation('to equal')(1, '1');
    getValidation('to strictly equal')(1, 1);
    getValidation('to deeply equal')({ a: [1] }, { a: [1] });
    getValidation('to contain')('qavajs', 'vaj');
    getValidation('to match')('qavajs', '^qa');
    getValidation('to be above')(5, '4');
    getValidation('to have type')('s', 'string');
    getValidation('to satisfy')(4, n => n % 2 === 0);
    assert.throws(() => getValidation('to strictly equal')(1, '1'));
    assert.throws(() => getValidation('not to equal')(1, '1'));
    assert.throws(() => getValidation('to be above')(5, 'x'), /x is not a number/);
});

test('case insensitive equal handles non-string values', () => {
    getValidation('to case insensitive equal')('QaVaJs', 'qavajs');
    getValidation('to case insensitive equal')(42, '42');
    assert.throws(() => getValidation('to case insensitive equal')(null, 'x'));
});

test('condition phrases map to chai chainers', () => {
    const cases = {
        'to be present': 'exist',
        'not to be visible': 'not.be.visible',
        'to be clickable': 'beClickable',
        'to be in viewport': 'inViewport',
        'not to be disabled': 'not.be.disabled'
    };
    for (const [phrase, chainer] of Object.entries(cases)) {
        assert.ok(fullMatch(conditionWaitRegexp, phrase), `regexp should match '${phrase}'`);
        assert.equal(getConditionExpect(phrase), chainer);
    }
    assert.throws(() => getConditionExpect('to be shiny'), /wait is not implemented/);
});
