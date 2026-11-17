import { defineConfig } from 'cypress';
import cucumber from '@qavajs/cypress-runner-adapter/adapter';
export default defineConfig({
    e2e: {
        specPattern: 'test-e2e/features/**/*.feature',
        supportFile: 'test-e2e/support/e2e.js',
        setupNodeEvents(on) {
            on('file:preprocessor', cucumber);
        }
    }
});
