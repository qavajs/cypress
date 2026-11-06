import { scenarioKey } from './utils.js';

/**
 * Dialog (alert/confirm/prompt) state of the running scenario.
 * Handlers are registered globally via Cypress.on so they survive navigation and,
 * in `describe` mode, the boundary between step tests. State is reset when a new scenario starts.
 */
const state = {
    scenario: undefined,
    confirm: undefined,
    prompt: undefined,
    messages: []
};

export function dialogs() {
    const key = scenarioKey(Cypress.currentTest?.titlePath);
    if (state.scenario !== key) {
        state.scenario = key;
        state.confirm = undefined;
        state.prompt = undefined;
        state.messages = [];
    }
    return state;
}

Cypress.on('window:alert', (text) => {
    dialogs().messages.push(text);
});

Cypress.on('window:confirm', (text) => {
    const current = dialogs();
    current.messages.push(text);
    // undefined keeps Cypress default behavior (accept)
    return current.confirm;
});

// Cypress does not handle window.prompt, so wrap it in every loaded window
Cypress.on('window:before:load', (win) => {
    const nativePrompt = win.prompt;
    win.prompt = function (message, ...args) {
        const current = dialogs();
        if (current.prompt === undefined) {
            return nativePrompt.call(win, message, ...args);
        }
        current.messages.push(message);
        return current.prompt;
    };
});
