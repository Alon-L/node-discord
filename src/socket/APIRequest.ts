import querystring, { ParsedUrlQueryInput } from 'querystring';
import fetch, { Response } from 'node-fetch';
import { HttpMethod } from './endpoints';
import { baseURL } from './properties';
import { Body, Params } from './rateLimit/Requests';

const paramsMethods: HttpMethod[] = [HttpMethod.Get];
const bodyMethods: HttpMethod[] = [HttpMethod.Post, HttpMethod.Patch, HttpMethod.Put];

/**
 * Creates and sends an HTTP request to Discord's API
 */
class APIRequest {
  private readonly token: string;
  private readonly endpoint: string;
  private readonly params: Params;
  private readonly method: HttpMethod;

  constructor(token: string, endpoint: string, params: Params, method: HttpMethod) {
    this.token = token;
    this.endpoint = endpoint;
    this.method = method;

    if (params) {
      // Clear all nullish params
      this.params = Object.entries(params)
        .filter(([, value]) => value === undefined || value === null)
        .reduce(
          (params, param) => ({
            ...params,
            param,
          }),
          {},
        );
    }
  }

  /**
   * Sends the API request
   * @returns {Promise<Response>}
   */
  public async send(): Promise<Response> {
    const { url, body, headers } = this;

    return fetch(url, {
      method: this.method,
      body: body && JSON.stringify(body),
      headers: headers,
    });
  }

  /**
   * Returns the full URL after adding the parameters if required
   * @type {string}
   */
  private get url(): string {
    let url = `${baseURL}${this.endpoint}`;

    // Add the parameters to the URL if the HTTP method is included in 'paramsMethods'
    if (this.params && paramsMethods.includes(this.method) && Object.keys(this.params).length) {
      url += `?${querystring.encode(this.params as ParsedUrlQueryInput)}`;
    }

    return url;
  }

  /**
   * Returns the body of the request
   * @type {Body | undefined}
   */
  private get body(): Body | undefined {
    // Only return a body if the HTTP method is included in 'bodyMethods'
    if (bodyMethods.includes(this.method) && this.params) {
      return this.params;
    }
  }

  /**
   * Returns the headers required for the request
   * @type {Record<string, string>}
   */
  private get headers(): Record<string, string> {
    // Default headers required for every request
    const headers: Record<string, string> = {
      'X-RateLimit-Precision': 'millisecond',
      Authorization: `Bot ${this.token}`,
    };

    // Adds the Content-Type header if the request contains a body
    if (this.body) headers['Content-Type'] = 'application/json';

    return headers;
  }
}

export default APIRequest;
