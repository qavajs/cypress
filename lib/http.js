import { When } from '@qavajs/cypress-runner-adapter';
import { dataTable2Object } from './utils.js';
import { logRequest } from './logger.js';

export class GraphQl {
    method = 'POST';
    headers = {'Content-Type': 'application/json'}
    _query = '';
    _variables = {};
    data = {};

    updateBody() {
        this.body = {query: this._query, variables: this._variables};
    };

    set query(query) {
        this._query = query;
        this.updateBody();
    };

    set variables(variables) {
        this._variables = JSON.parse(variables);
        this.updateBody();
    };
}

/**
 * Create request template and save it to memory
 * @param {string} method - should be named as one of the http methods (e.g. GET, POST, PUT, DELETE and etc.)
 *
 * @example
 * When I create 'GET' request 'request'
 */
When('I create {string} request {value}', function (method, key) {
    cy.then(() => {
        key.set({ method });
    });
});

/**
 * Create GraphQL request template and save it to memory
 * @example
 * When I create GraphQL request 'request'
 */
When('I create GraphQL request {value}', function (key) {
    cy.then(() => {
        key.set(new GraphQl());
    });
});

/**
 * Add data table of headers to request
 * @param {string} requestKey - memory key of request
 * @param {Array<[string, string]>} headersDataTable - key value headers
 *
 * @example
 * When I add headers to '$request':
 *   | Content-Type | application/json |
 */
When('I add headers to {value}:', function (requestKey, headersDataTable) {
    cy.then(() => {
        const request = requestKey.value();
        request.headers = Object.assign({}, request.headers, dataTable2Object(this, headersDataTable));
    });
});

/**
 * Add headers to request
 * @param {string} requestKey - memory key of request
 * @param {string} headersKey - memory key of headers that resolves to JS object
 *
 * @example
 * When I add '$headers' headers to '$request'
 */
When('I add {value} headers to {value}', function (headersKey, requestKey) {
    cy.then(() => {
        const request = requestKey.value();
        request.headers = Object.assign({}, request.headers, headersKey.value());
    });
});

/**
 * Add body to request
 * @param {string} requestKey - memory key of request
 * @param {string} body - body
 *
 * @example
 * When I add body to '$request':
 * """
 *  {
 *      "message": "qavajs"
 *  }
 * """
 */
When('I add body to {value}:', function ( requestKey, body) {
    cy.then(() => {
        const request = requestKey.value();
        request.data = this.value(body);
    });
});

/**
 * Add query or variables to GraphQL request.
 * @param {string} property - one of GraphQl specific properties "query" or "variables"
 * @param {string} requestKey - memory key of request
 * @param {string} valueString - multiline string to be set as GraphQl body value.
 *
 * @example
 * When I add query to GraphQL '$request':
 * """
 *    query {
 *      characters(page: 2, filter: { name: "rick" }) {
 *        results {
 *          name
 *           }
 *         }
 *      }
 **/
When('I add {gqlRequestProperty} to GraphQL {value}:', function (property, requestKey, valueString) {
    cy.then(() => {
        const request = requestKey.value();
        request[property] = this.value(valueString);
    });
});

/**
 * Add form data body to request
 * @param {string} requestKey - memory key of request
 * @param {string} body - body
 *
 * @example
 * When I add body to '$request':
 *   | key      | value                    | filename | contentType      |
 *   | formKey  | formValue                |          | application/json |
 *   | otherKey | otherValue               |          | text/plain       |
 *   | fileKey  | $file('./path/file.png') | file.png | image/png        |
 */
When('I add form data body to {value}:', function (requestKey, dataTable) {
    cy.then(() => {
        const request = requestKey.value();
        const formData = new FormData();
        for (const record of dataTable.hashes()) {
            const key = this.value(record.key);
            const value = this.value(record.value);
            const fileName = this.value(record.filename) ?? 'default';
            const type = this.value(record.contentType);
            formData.append(key, new Blob([value], { type }), fileName);
        }
        request.data = formData;
    });
});

/**
 * Add body to request
 * @param {string} requestKey - memory key of request
 * @param {string} body - body
 *
 * @example
 * When I add '$body' body to '$request'
 */
When('I add {value} body to {value}', function (bodyKey, requestKey) {
    cy.then(() => {
        const request = requestKey.value();
        request.data = bodyKey.value();
    });
});

/**
 * Add url to request
 * @param {string} requestKey - memory key of request
 * @param {string} url - url
 *
 * @example
 * When I add 'https://qavajs.github.io/' url to '$request'
 */
When('I add {value} url to {value}', function (urlKey, requestKey) {
    cy.then(() => {
        const request = requestKey.value();
        request.url = urlKey.value();
    });
});

/**
 * Send request and save response.
 * Responses with non-2xx status do not fail the step, validate `$response.status` instead.
 * Set `failOnStatusCode: true` on the request object to restore Cypress default behavior.
 * @param {string} requestKey - memory key of request
 * @param {string} responseKey - memory key to save response
 *
 * @example
 * When I send '$request' request and save response as 'response'
 */
When('I send {value} request and save response as {value}', function (requestKey, responseKey) {
    cy.then(() => {
        const request = requestKey.value();
        // default cy.request log is replaced with masked one
        // non-2xx responses are saved instead of failing the step, so they can be validated
        cy.request({ failOnStatusCode: false, ...request, log: false }).then(response => {
            logRequest(request, response);
            responseKey.set(response);
        });
    });
});