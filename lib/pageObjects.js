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

export function query(root, path) {
    const elements = path.split(/\s*>\s*/);
    const tokens = [];
    let currentComponent = typeof root === 'function' ? new root() : root;
    let currentAlias = 'App';
    for (const element of elements) {
        const groups = element.match(/^(?<alias>.+?)(?:\((?<argument>.+)\))?$/)?.groups;
        const alias = groups.alias.replace(/\s/g, '');
        if (!currentComponent) {
            throw new Error(`Alias '${currentAlias}' is not a component`);
        }
        const currentElement = currentComponent[alias];
        if (!currentElement) throw new Error(`Alias '${alias}' has not been found in '${currentAlias}'`);
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
            method = item.selector ? 'find' : 'get';
        }
        Cypress.log({
            displayName: `${path} →`,
            message: logChain,
            type: 'parent',
            consoleProps: () => {
                return {
                    Key: path,
                    Element: logChain,
                }
            },
            alias: path,
            aliasType: 'dom'
        });
        return current;
    });
}