import { defineParameterType } from '@qavajs/cypress-runner-adapter';
import { getConditionExpect, conditionWaitRegexp } from './conditionExpect.js';
import { MemoryValue } from './memoryValue.js';
import { getValidation, validationRegexp } from './valueExpect.js';

function transformString(fn) {
    return function (s1, s2) {
        const expression = (s1 || s2 || '').replace(/\\"/g, '"').replace(/\\'/g, "'")
        return fn(expression);
    }
}

defineParameterType({
    name: 'value',
    regexp: /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/,
    transformer: function (s1, s2) {
        const world = this;
        return transformString(function (expression) {
            return new MemoryValue(world, expression);
        })(s1, s2);
    }
});

defineParameterType({
    name: 'locator',
    regexp: /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/,
    transformer: function (s1, s2) {
        const world = this;
        return transformString(function (alias) {
            return world.element(alias);
        })(s1, s2);
    }
});

defineParameterType({
    name: 'validation',
    regexp: validationRegexp,
    useForSnippets: false,
    transformer: getValidation
});

defineParameterType({
    name: 'condition',
    regexp: conditionWaitRegexp,
    transformer: getConditionExpect,
    useForSnippets: false
});

defineParameterType({
    name: 'mouseButton',
    regexp: /(left|right|middle)/,
    transformer: button => ({ left: 1, right: 2, middle: 4 }[button]),
    useForSnippets: false
});

defineParameterType({
    name: 'storageType',
    regexp: /local|session/,
    transformer: s => s,
    useForSnippets: false
});

defineParameterType({
    name: 'browserButton',
    regexp: /(back|forward)/,
    useForSnippets: false
});

/**
 * Parse http response body
 * @returns {string}
 */
defineParameterType({
    name: 'bodyParsingType',
    regexp: /buffer|json|text/,
    transformer: p => p === 'buffer' ? 'body' : p,
    useForSnippets: false,
});

/**
 * GraphQL request property
 * @returns {string}
 */
defineParameterType({
    name: 'gqlRequestProperty',
    regexp: /query|variables/,
    transformer: s => s,
    useForSnippets: false,
});