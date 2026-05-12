/** Determines how a selector is resolved against the DOM. */
export type SelectorType = 'simple' | 'template' | 'native';

/** Represents a page-object element definition. */
export declare class Selector {
    /** selector string */
    selector: string | null;
    /** Resolution strategy used when traversing the element chain. */
    type: SelectorType;
    /** Optional component class whose properties describe child elements. */
    component?: new () => object;

    constructor(selector: string | null, type?: SelectorType);

    /**
     * Attach a component class to this selector so its properties can be
     * used as child element aliases.
     * @param component - Component class whose instance defines child aliases.
     */
    as(component: new () => object): this;
}

export interface LocatorFn {
    /**
     * Create a simple selector entry.
     * @param selector - Selector string.
     */
    (selector: string): Selector;

    /**
     * Create a template selector whose final value is produced by calling
     * `Alias (argument)` at query time, allowing dynamic substitution.
     * @param selector - Function that receives the runtime argument and returns the selector string.
     */
    template(selector: (argument: string) => string): Selector;

    /**
     * Create a native selector resolved via a custom Cypress command chain.
     * The function receives context at query time and must return a Chainable.
     * @param selector - Function that builds and returns a Cypress Chainable.
     */
    native(selector: (ctx: { parent: Cypress.Chainable; cy: Cypress.cy; argument: string }) => Cypress.Chainable): Selector;

    /**
     * Create a component-only node with no selector of its own.
     * Useful when the root of a sub-tree is already in scope.
     * @param component - Component class whose instance defines child aliases.
     */
    as(component: new () => object): Selector;
}

/** Factory for building page-object element definitions. */
export declare const locator: LocatorFn;
