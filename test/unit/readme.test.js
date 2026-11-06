import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import '../../index.js';

const readme = readFileSync(new URL('../../README.md', import.meta.url), 'utf8');
const { stepDefinitions } = globalThis.window.supportCodeLibrary;

/**
 * Placeholders used in README step tables and sample values that replace them.
 * Any quoted placeholder ('{key}', '{locator}', ...) is replaced with a quoted sample.
 */
const placeholders = {
    validation: 'to equal',
    condition: 'to be visible',
    int: '2',
    mouseButton: 'left'
};

/**
 * Steps from README tables: first code span of every table row inside 'Step Definitions' section
 */
function readmeSteps() {
    const section = readme.slice(readme.indexOf('## Step Definitions'), readme.indexOf('## Example Feature'));
    return section
        .split('\n')
        .filter(line => line.startsWith('| `'))
        .map(line => line.match(/^\| `([^`]+)`/)[1]);
}

function toStepText(step) {
    return step
        .replace(/'\{\w+\}'/g, "'sample'")
        .replace(/\{(\w+)\}/g, (match, name) => {
            if (!(name in placeholders)) {
                throw new Error(`Unknown README placeholder ${match} in '${step}'`);
            }
            return placeholders[name];
        })
        // docstring/data table steps end with ':' in definitions too
        .trim();
}

const steps = readmeSteps().map(step => ({ step, text: toStepText(step) }));

test('README lists steps', () => {
    assert.ok(steps.length > 50, `expected README step tables to be parsed, got ${steps.length} steps`);
});

test('every README step matches exactly one step definition', () => {
    const problems = [];
    for (const { step, text } of steps) {
        const matches = stepDefinitions.filter(definition => definition.matchesStepName(text));
        if (matches.length === 0) problems.push(`not defined: ${step}`);
        if (matches.length > 1) {
            problems.push(`ambiguous: ${step} -> ${matches.map(definition => definition.pattern).join(' | ')}`);
        }
    }
    assert.deepEqual(problems, []);
});

test('every step definition is documented in README', () => {
    const undocumented = stepDefinitions
        .filter(definition => !steps.some(({ text }) => definition.matchesStepName(text)))
        .map(definition => String(definition.pattern));
    assert.deepEqual(undocumented, []);
});

/**
 * Items of README list line, e.g. '**Conditions:** `to be visible`, ...'
 */
function listItems(title) {
    const line = readme.split('\n').find(l => l.startsWith(`**${title}:**`));
    assert.ok(line, `README should have '${title}' list`);
    return [...line.matchAll(/`([^`]+)`/g)].map(match => match[1]);
}

test('every README condition is supported', async () => {
    const { getConditionExpect } = await import('../../lib/conditionExpect.js');
    for (const condition of listItems('Conditions')) {
        assert.doesNotThrow(() => getConditionExpect(condition), `condition '${condition}'`);
        assert.doesNotThrow(() => getConditionExpect(`not ${condition}`), `condition 'not ${condition}'`);
    }
});

test('every README validation is supported', async () => {
    const { getValidation } = await import('../../lib/valueExpect.js');
    for (const validation of listItems('Validations')) {
        assert.doesNotThrow(() => getValidation(`to ${validation}`), `validation 'to ${validation}'`);
    }
});
