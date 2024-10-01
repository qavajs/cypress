import { po } from '@qavajs/po-cypress';
import memory from '@qavajs/memory';
import { setWorldConstructor } from '@qavajs/cypress-runner-adapter';

const logger = {
    log: (value) => {
        const [displayName, divider, message] = value.split(/\s(->|<-)\s/);
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
    }
};

export class QavajsCypressWorld {

    constructor() {
        po.init(cy, { logger });
        po.register(window.pageObject);
        memory.register(window.memory);
        memory.setLogger(logger);
        this.po = po;
        this.memory = memory;
    }

    element(alias) {
        return this.po.getElement(this.memory.getValue(alias));
    }

    value(expression) {
        return this.memory.getValue(expression);
    }

    setValue(key, value) {
        this.memory.setValue(key, value);
    }
}

setWorldConstructor(QavajsCypressWorld);
