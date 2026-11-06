import { installFakeCy } from './globals.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locator, query, element } from '../../lib/pageObjects.js';

class Item {
    Title = locator('.title');
}

class Wrapper {
    Child = locator('.child');
}

class App {
    Button = locator('#button');
    List = locator('ul').as(Item);
    ItemByIndex = locator.template(index => `li:nth-child(${index})`).as(Item);
    Native = locator.native(({ parent, argument }) => parent.find(argument));
    Parent = locator('#parent').as(class {
        Wrapper = locator.as(Wrapper);
    });
}

test('query resolves simple path', () => {
    const [button] = query(new App(), 'Button');
    assert.equal(button.selector, '#button');
    assert.equal(button.type, 'simple');
});

test('query resolves nested components and arguments', () => {
    const chain = query(App, 'Item By Index (2) > Title');
    assert.deepEqual(chain.map(c => [c.alias, c.argument, c.type]), [
        ['ItemByIndex', '2', 'template'],
        ['Title', undefined, 'simple']
    ]);
});

test('query throws on unknown alias', () => {
    assert.throws(() => query(App, 'Missing'), /Alias 'Missing' has not been found in 'App'/);
});

test('query throws when alias is not a component', () => {
    assert.throws(() => query(App, 'Button > Title'), /Alias 'Button' is not a component/);
});

test('query throws on empty path segment', () => {
    assert.throws(() => query(App, 'List > '), /Invalid path 'List > ': empty alias after 'List'/);
});

test('element builds scoped chain', () => {
    const { calls } = installFakeCy();
    element.call({ pageObject: new App(), cy }, 'Item By Index (3) > Title');
    assert.deepEqual(calls, ['get(li:nth-child(3))', 'find(.title)']);
});

test('component without selector keeps parent scope', () => {
    const { calls } = installFakeCy();
    element.call({ pageObject: new App(), cy }, 'Parent > Wrapper > Child');
    assert.deepEqual(calls, ['get(#parent)', 'find(.child)']);
});

test('native selector receives parent chain and argument', () => {
    const { calls } = installFakeCy();
    element.call({ pageObject: new App(), cy }, 'List > Title');
    element.call({ pageObject: new App(), cy }, 'Native (.x)');
    assert.deepEqual(calls, ['get(ul)', 'find(.title)', 'find(.x)']);
});
