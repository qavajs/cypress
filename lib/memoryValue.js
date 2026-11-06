export class MemoryValue {
    constructor(world, expression) {
        this.world = world;
        this.expression = expression;
    }

    /**
     * Return resolved value.
     * Resolution is synchronous, so call it inside a Cypress command callback (e.g. `cy.then`)
     * to get values saved by previous steps.
     * @example
     * cy.then(() => url.value())
     * @return {any}
     */
    value() {
        return this.world.value(this.expression);
    }

    /**
     * Set value to memory with provided key
     * @param value any - value to set
     * @example
     * url.set('https://qavajs.github.io/')
     */
    set(value) {
        this.world.setValue(this.expression, value);
    }

    toString() {
        return this.expression;
    }
}
