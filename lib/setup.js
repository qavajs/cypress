import memory from '@qavajs/memory';
import { setWorldConstructor, World } from '@qavajs/cypress-runner-adapter';
import { element } from './pageObjects.js';
import { getQavajsOptions } from './defineQavajs.js';
import { logger } from './logger.js';

export class QavajsCypressWorld extends World {

    constructor(options) {
        super(options);
        const { pageObject, memory: memoryValues } = getQavajsOptions();
        if (memoryValues) {
            memory.register(memoryValues);
        }
        memory.setLogger(logger);
        this.memory = memory;
        this.pageObject = pageObject;
        this.element = element;
        this.cy = cy;
        this.frame = cy;
        this.log = logger.log;
    }

    value(expression) {
        return this.memory.getValue(expression);
    }

    setValue(key, value) {
        this.memory.setValue(key, value);
    }

}

setWorldConstructor(QavajsCypressWorld);
