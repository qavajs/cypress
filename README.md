# @qavajs/cypress
qavajs implementation for cypress runner

## Installation

`npm install @qavajs/cypress @qavajs/cypress-runner-adapter @qavajs/memory`

## Configuration
cypress.config.js
```javascript
const { defineConfig } = require('cypress');
const cucumber = require('@qavajs/cypress-runner-adapter/adapter');
module.exports = defineConfig({
    e2e: {
        specPattern: 'cypress/features/**/*.feature', //path to features
        supportFile: 'cypress/support/e2e.js', //path to main support file
        setupNodeEvents(on, config) {
            on('file:preprocessor', cucumber)
        },
    },
});

```
support file
```typescript
import defineQavajs from '@qavajs/cypress/defineQavajs';
import '@qavajs/cypress';

import PageObject from '../page_object/'; // path to qavajs page objects
import Memory from '../memory'; // path to qavajs memory

defineQavajs({
    pageObject: new PageObject(),
    memory: new Memory()
});


```

## Development and testing
Install dependencies
`npm install`


Execute tests
`npm run test`

Debug tests
`npm run debug`
