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

locator.template = function(selector) {
    return new Selector(selector, 'template');
}

locator.native = function(selector) {
    return new Selector(selector, 'native');
}

export class ChainItem {
    constructor({ alias, argument, selector, type }) {
        this.alias = alias;
        this.argument = argument;
        this.selector = selector;
        this.type = type;
    }
}

export function query(root, path) {
    const elements = path.split(/\s*>\s*/);
    const tokens = [];
    let currentComponent = new root();
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
    const chain = query(this.pageObject, path);
    let current = this.cy;
    for (const item of chain) {
        switch (item.type) {
            case 'simple':
                current = current.get(item.selector);
                break;
            case 'template':
                current = current.get(item.selector(item.argument));
                break;
            case 'native':
                current = item.selector({
                    parent: current,
                    cy: this.cy,
                    argument: item.argument
                });
                break;
        }
    }
    return current
}