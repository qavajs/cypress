import { defineParameterType } from '@qavajs/cypress-runner-adapter';
import { getConditionExpect } from './conditionExpect';
import { MemoryValue } from './memoryValue';
import { getValidation } from './valueExpect';

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
    regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(softly )?(equal|strictly equal|deeply equal|have member|match|contain|above|below|greater than|less than|have type|have property|match schema|include members|satisfy|case insensitive equal)(?:s|es| to)?)/,
    useForSnippets: false,
    transformer: getValidation
});

defineParameterType({
    name: 'condition',
    regexp: /((not )?to (?:be )?(present|clickable|visible|invisible|enabled|disabled|in viewport))/,
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