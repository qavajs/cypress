import { logElement } from './logger.js';

export class Selector {
    type = 'simple';

    constructor(selector, type) {
        this.selector = selector;
        if (type) {
            this.type = type;
        }
    }

    /**
     * Define current locator as component
     * @param { Function } component
     */
    as(component) {
        this.component = component;
        return this;
    }
}

export const locator = function locator(selector) {
    return new Selector(selector);
}

locator.template = function (selector) {
    return new Selector(selector, 'template');
}

locator.native = function (selector) {
    return new Selector(selector, 'native');
}

locator.as = function (component) {
    const selector = new Selector(null);
    selector.component = component;
    return selector;
}

export class ChainItem {
    constructor({alias, argument, selector, type}) {
        this.alias = alias;
        this.argument = argument;
        this.selector = selector;
        this.type = type;
    }
}

/**
 * Levenshtein distance between two strings
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
export function distance(a, b) {
    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
        const current = [i];
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + cost);
        }
        previous = current;
    }
    return previous[b.length];
}

const MAX_LISTED_ALIASES = 30;

/**
 * Check that value is a page object element definition.
 * Duck typing keeps it working when the package is bundled twice.
 */
function isSelector(value) {
    return value instanceof Selector || (typeof value === 'object' && value !== null && 'selector' in value && 'type' in value);
}

/**
 * Build error message for missing alias with closest matches and the list of available aliases
 * @param {string} alias - requested alias (whitespace removed)
 * @param {string} parentAlias - alias of the component that was searched
 * @param {object} component - component instance
 * @return {string}
 */
export function aliasNotFoundMessage(alias, parentAlias, component) {
    const available = Object.keys(component).filter(key => isSelector(component[key]));
    const normalized = alias.toLowerCase();
    const threshold = Math.max(2, Math.floor(normalized.length / 3));
    const suggestions = available
        .map(key => ({ key, score: distance(normalized, key.toLowerCase()) }))
        .filter(({ score }) => score <= threshold)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)
        .map(({ key }) => `'${key}'`);
    let message = `Alias '${alias}' has not been found in '${parentAlias}'.`;
    if (suggestions.length) {
        message += ` Did you mean ${suggestions.join(' or ')}?`;
    }
    if (available.length === 0) {
        message += ` '${parentAlias}' has no aliases.`;
    } else {
        const listed = available.slice(0, MAX_LISTED_ALIASES).join(', ');
        const more = available.length > MAX_LISTED_ALIASES ? `, ... (${available.length - MAX_LISTED_ALIASES} more)` : '';
        message += `\nAvailable aliases: ${listed}${more}`;
    }
    return message;
}

export function query(root, path) {
    const elements = path.split(/\s*>\s*/);
    const tokens = [];
    let currentComponent = typeof root === 'function' ? new root() : root;
    let currentAlias = 'App';
    for (const element of elements) {
        const groups = element.match(/^(?<alias>.+?)\s*(?:\((?<argument>.+)\))?$/)?.groups;
        if (!groups) throw new Error(`Invalid path '${path}': empty alias after '${currentAlias}'`);
        const alias = groups.alias.replace(/\s/g, '');
        if (!currentComponent) {
            throw new Error(`Alias '${currentAlias}' is not a component`);
        }
        const currentElement = currentComponent[alias];
        if (!isSelector(currentElement)) {
            throw new Error(aliasNotFoundMessage(alias, currentAlias, currentComponent));
        }
        currentAlias = groups.alias;
        currentComponent = currentElement.component ? new currentElement.component() : null;

        tokens.push(new ChainItem({
            alias,
            argument: groups.argument,
            selector: currentElement.selector,
            type: currentElement.type,
        }));
    }

    return tokens;
}

export function element(path) {
    return cy.then(() => {
        const chain = query(this.pageObject, path);
        let current = this.cy;
        let method = 'get';
        let logChain = `cy`;

        const applySelector = (selector) => {
            if (!selector) return;
            logChain += `.${method}('${selector}')`;
            current = current[method](selector);
        };

        const applyNative = (item) => {
            logChain += `.native([function])`;
            current = item.selector({
                parent: current,
                cy: this.cy,
                argument: item.argument
            });
        };

        for (const item of chain) {
            switch (item.type) {
                case 'simple': {
                    applySelector(item.selector);
                }
                    break;
                case 'template': {
                    const selector = item.selector(item.argument);
                    applySelector(selector);
                }
                    break;
                case 'native': {
                    applyNative(item);
                }
                    break;
                default:
                    throw new Error(`Unsupported selector type '${item.type}' for alias '${item.alias}'`);
            }
            // component without selector keeps the scope of its parent
            if (item.selector) method = 'find';
        }
        logElement(path, logChain, chain);
        return current;
    });
}