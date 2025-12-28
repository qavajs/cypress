import { When } from '@qavajs/cypress-runner-adapter';
import { dataTable2Object } from './utils';

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
    key.set({ method });
});

/**
 * Create GraphQL request template and save it to memory
 * @example
 * When I create GraphQL request 'request'
 */
When('I create GraphQL request {value}', function (key) {
    key.set(new GraphQl());
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
When('I add headers to {value}:', async function (requestKey, headersDataTable) {
    const request = requestKey.value();
    request.headers = Object.assign({}, request.headers, dataTable2Object(this, headersDataTable));
});

/**
 * Add headers to request
 * @param {string} requestKey - memory key of request
 * @param {string} headersKey - memory key of headers that resolves to JS object
 *
 * @example
 * When I add '$headers' headers to '$request'
 */
When('I add {value} headers to {value}', async function (headersKey, requestKey) {
    const request = requestKey.value();
    request.headers = Object.assign({}, request.headers, headersKey.value());
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
When('I add body to {value}:', async function ( requestKey, body) {
    const request = requestKey.value();
    request.data = this.value(body);
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
When('I add {gqlRequestProperty} to GraphQL {value}:', async function (property, requestKey, valueString) {
    const request = requestKey.value();
    request[property] = this.value(valueString);
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
When('I add form data body to {value}:', async function (requestKey, dataTable) {
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

/**
 * Add body to request
 * @param {string} requestKey - memory key of request
 * @param {string} body - body
 *
 * @example
 * When I add '$body' body to '$request'
 */
When('I add {value} body to {value}', async function (bodyKey, requestKey) {
    const request = requestKey.value();
    request.data = bodyKey.value();
});

/**
 * Add url to request
 * @param {string} requestKey - memory key of request
 * @param {string} url - url
 *
 * @example
 * When I add 'https://qavajs.github.io/' url to '$request'
 */
When('I add {value} url to {value}', async function (urlKey, requestKey) {
    const request = requestKey.value();
    request.url = urlKey.value();
});

/**
 * Send request and send response
 * @param {string} requestKey - memory key of request
 * @param {string} responseKey - memory key to save response
 *
 * @example
 * When I send '$request' request and save response as 'response'
 */
When('I send {value} request and save response as {value}', async function (requestKey, responseKey) {
    const request = requestKey.value();
    cy.request(request).then(response => {
        responseKey.set(response);
    });
});