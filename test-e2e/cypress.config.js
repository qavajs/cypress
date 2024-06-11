const { defineConfig } = require('cypress');
const cucumber = require('@qavajs/cypress-runner-adapter/adapter');
module.exports = defineConfig({
  e2e: {
    specPattern: 'test-e2e/features/**/*.feature',
    supportFile: 'test-e2e/support/e2e.js',
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber)
    },
  },
});
