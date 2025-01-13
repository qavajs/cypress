export class MemoryValue {
    constructor(world, expression) {
        this.world = world;
        this.expression = expression;
    }

    /**
     * Return resolved value
     * @example
     * url.value()
     * @return Promise<any>
     */
    value() {
        return this.world.value(this.expression)
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
}