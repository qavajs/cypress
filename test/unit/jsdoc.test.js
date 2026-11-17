import './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import '../../index.js';

const { stepDefinitions } = globalThis.window.supportCodeLibrary;
const libDir = new URL('../../lib/', import.meta.url);

const STEP_RE = /\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\n(?:When|Then)\(\s*'([^']+)'/g;
const KEYWORD_RE = /^(?:Given|When|Then|And|But) /;

/**
 * Documented steps of lib modules: step pattern and lines of its @example tags
 * @return {Array<{ file: string, pattern: string, examples: string[][] }>}
 */
function documentedSteps() {
    const steps = [];
    for (const file of readdirSync(libDir).filter(name => name.endsWith('.js'))) {
        const source = readFileSync(new URL(file, libDir), 'utf8');
        for (const [, comment, pattern] of source.matchAll(STEP_RE)) {
            const lines = comment.split('\n').map(line => line.replace(/^\s*\* ?/, '').replaceAll('*\\/', '*/'));
            const examples = [];
            for (const line of lines) {
                if (line.startsWith('@example')) {
                    examples.push([]);
                    const inline = line.slice('@example'.length).trim();
                    if (inline) examples.at(-1).push(inline);
                } else if (line.startsWith('@')) {
                    examples.push(null);
                } else if (examples.at(-1)) {
                    examples.at(-1).push(line.trim());
                }
            }
            steps.push({ file, pattern, examples: examples.filter(Boolean) });
        }
    }
    return steps;
}

/**
 * Step lines of example: docstring and data table lines are skipped
 */
function stepLines(example) {
    const lines = [];
    let docString = false;
    for (const line of example) {
        if (line.startsWith('"""')) {
            docString = !docString;
            continue;
        }
        if (docString || line.startsWith('|') || line === '') continue;
        lines.push(line.replace(KEYWORD_RE, ''));
    }
    return lines;
}

const steps = documentedSteps();

test('every step definition has JSDoc with example', () => {
    const documented = new Set(steps.map(({ pattern }) => pattern));
    const undocumented = stepDefinitions.map(({ pattern }) => String(pattern)).filter(pattern => !documented.has(pattern));
    assert.deepEqual(undocumented, []);
    const withoutExamples = steps.filter(({ examples }) => examples.length === 0).map(({ pattern }) => pattern);
    assert.deepEqual(withoutExamples, []);
});

test('JSDoc examples match documented step definition', () => {
    const problems = [];
    for (const { file, pattern, examples } of steps) {
        for (const example of examples) {
            const [first, ...rest] = stepLines(example);
            const matches = stepDefinitions.filter(definition => definition.matchesStepName(first));
            if (matches.length !== 1 || String(matches[0].pattern) !== pattern) {
                problems.push(`${file}: '${first}' does not match '${pattern}' (matches: ${matches.map(m => m.pattern).join(' | ') || 'none'})`);
            }
            for (const line of rest) {
                if (!stepDefinitions.some(definition => definition.matchesStepName(line))) {
                    problems.push(`${file}: '${line}' in example of '${pattern}' is not a step`);
                }
            }
        }
    }
    assert.deepEqual(problems, []);
});
