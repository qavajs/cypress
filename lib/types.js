import { defineParameterType } from '@qavajs/cypress-runner-adapter';

defineParameterType({
    name: 'validation',
    regexp: /((?:is |do |does |to )?(not |to not )?(?:to )?(?:be )?(equal|strictly equal|deeply equal|have member|match|contain|above|below|greater than|less than|have type)(?:s|es)?)/,
    useForSnippets: false
});

defineParameterType({
    name: 'conditionExpect',
    regexp: /((not )?to (?:be )?(present|clickable|visible|invisible|enabled|disabled|in viewport))/,
    useForSnippets: false
});

defineParameterType({
    name: 'poType',
    regexp: /(element|collection)/,
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
