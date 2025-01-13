export default class Memory {
    valuesPage = './test-e2e/apps/values.html';
    actionsPage = './test-e2e/apps/actions.html';
    framePage = './test-e2e/apps/frame.html';
    waitsPage = './test-e2e/apps/waits.html';
    mockPage = './test-e2e/apps/mock.html';
    storagePage = './test-e2e/apps/storage.html';
    dragDropPage = './test-e2e/apps/dragdrop.html';
    scrollPage = './test-e2e/apps/scroll.html';
    array = (...args) => args;
    setInputValue = function() { return this.document.querySelector('#input').value = 'some value' };
    getActionInnerText = function() { return this.document.querySelector("#action").innerText };
    clickJS = target => target.click();
    getInnerText = target => target.innerText;
    userFromMemory = 'Mock 3';
    users = JSON.stringify([
        {"name": "Memory Mock 1"},
        {"name": "Memory Mock 2"},
        {"name": "Memory Mock 3"}
    ]);
    button2 = 'Button2';
    userInterceptionMatcher = {
        method: 'GET',
        url: '**/users'
    };
    uploadFile = 'test-e2e/apps/actions.html';
    getComputedString = function () {
        return 'I was computed';
    };
    multilineMemoryValue = `Carriage\nreturn`;
    arr = [1, 2, 3, 4, 5];
    reverseArr = [5, 4, 3, 2, 1];
    ascending = (a, b) => a - b;
    descending = (a, b) => b - a;
}
