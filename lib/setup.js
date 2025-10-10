import memory from '@qavajs/memory';
import {setWorldConstructor} from '@qavajs/cypress-runner-adapter';
import {element} from './pageObjects';

const logger = {
    log: (value) => {
        const [displayName, divider, message] = value.split(/\s(->|<-)\s/);
        cy.then(() => {
            Cypress.log({
                displayName: `${displayName} ${divider}`,
                message,
                type: 'parent',
                consoleProps: () => {
                    return {
                        Key: displayName,
                        Value: message,
                    }
                }
            })
        });
    }
};

export class QavajsCypressWorld {

    constructor() {
        memory.register(window.memory);
        memory.setLogger(logger);
        this.memory = memory;
        this.pageObject = window.pageObject;
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
