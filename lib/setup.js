import {po} from '@qavajs/po-cypress';
import App from '../test-e2e/page_object';
import memory from '@qavajs/memory';
import Memory from '../test-e2e/memory';
import { setWorldConstructor } from '@qavajs/cypress-runner-adapter';

export class QavajsCypressWorld {

    constructor() {
        po.init(cy, { logger: { log: (value) => {
                    const [displayName, message] = value.split(/\s->\s/);
                    Cypress.log({
                        displayName,
                        message
                    })
                }
            }
        });
        po.register(window.pageObject);
        memory.register(window.memory);
        memory.setLogger({ log: (value) => {
                const [displayName, message] = value.split(/\s->\s/);
                Cypress.log({
                    displayName,
                    message
                })
            }
        });
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
