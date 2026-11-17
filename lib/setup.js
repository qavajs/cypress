import { setWorldConstructor, World } from '@qavajs/cypress-runner-adapter';
import { element } from './pageObjects.js';
import { getQavajsOptions } from './defineQavajs.js';
import { withRawValue } from './logger.js';
import { scenarioMemory } from './scenarioMemory.js';

export class QavajsCypressWorld extends World {

    constructor(options) {
        super(options);
        const { pageObject } = getQavajsOptions();
        this.pageObject = pageObject;
        this.element = element;
        this.cy = cy;
        this.frame = cy;
    }

    /**
     * Memory of the current scenario: values saved by previous scenarios are not available
     */
    get memory() {
        return scenarioMemory(this, getQavajsOptions().memory);
    }

    value(expression) {
        return withRawValue(() => this.memory.getValue(expression), value => value);
    }

    setValue(key, value) {
        withRawValue(() => this.memory.setValue(key, value), () => value);
    }

}

setWorldConstructor(QavajsCypressWorld);
