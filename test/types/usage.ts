// Compile-time checks of public typings (run with `npm run typecheck`)
import { When } from '@qavajs/cypress-runner-adapter';
import type { QavajsCypressWorld, MemoryValue, Interception } from '../../index';
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
defineQavajs({ pageObject: App, log: false });
defineQavajs({ pageObject: App, log: { memory: false, maxLength: 0, mask: ['password', /token/i] } });
// @ts-expect-error mask must be an array
defineQavajs({ pageObject: App, log: { mask: 'token' } });

When('I type {value} slowly into {locator}', function (
    this: QavajsCypressWorld,
    text: MemoryValue,
    element: Cypress.Chainable<JQuery<HTMLElement>>
) {
    element.then($el => cy.wrap($el).type(text.value<string>(), { delay: 200 }));
    this.element('List > Item (1)').click();
    this.setValue('key', this.value('$url'));
});

When('I expect {value} interception to be called', function (this: QavajsCypressWorld, interception: MemoryValue) {
    cy.then(() => {
        const { calls, result } = interception.value<Interception>();
        expect(calls.length).to.be.above(0);
        const status: number | undefined = result?.response?.statusCode;
        return status;
    });
});
