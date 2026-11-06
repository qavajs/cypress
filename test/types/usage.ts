// Compile-time checks of public typings (run with `npm run typecheck`)
import { When } from '@qavajs/cypress-runner-adapter';
import type { QavajsCypressWorld, MemoryValue } from '../../index';
import defineQavajs from '../../defineQavajs';
import { locator } from '../../po';

class Component {
    Item = locator.template((index: string) => `li:nth-child(${index})`);
}

class App {
    Button = locator('#button');
    List = locator('ul').as(Component);
    Native = locator.native(({ parent, argument }) => parent.find(argument));
}

defineQavajs({ pageObject: new App(), memory: { url: 'https://qavajs.github.io' } });
defineQavajs({ pageObject: App });

When('I type {value} slowly into {locator}', function (
    this: QavajsCypressWorld,
    text: MemoryValue,
    element: Cypress.Chainable<JQuery<HTMLElement>>
) {
    element.then($el => cy.wrap($el).type(text.value<string>(), { delay: 200 }));
    this.element('List > Item (1)').click();
    this.setValue('key', this.value('$url'));
});
