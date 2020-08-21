import querystring, { ParsedUrlQueryInput } from 'querystring';
import FormData from 'form-data';
import fetch, { Response } from 'node-fetch';
import { APIFile } from './APIFile';
import { HttpMethod } from '../../socket/endpoints';
import { baseURL } from '../../socket/properties';
import { Params, RequestFile } from '../../socket/rateLimit';

const paramsMethods: HttpMethod[] = [HttpMethod.Get];
const bodyMethods: HttpMethod[] = [HttpMethod.Post, HttpMethod.Patch, HttpMethod.Put];

/**
 * Enum containing common request headers
 */
export enum Header {
  ContentType = 'content-type',
}

/**
 * Creates and sends an HTTP request to Discord's API
 */
export class APIRequest {
  private readonly token: string;
  private readonly endpoint: string;
  private readonly params: Params;
  private readonly method: HttpMethod;
  private readonly files: APIFile[] | undefined;

  constructor(
    token: string,
    endpoint: string,
    params: Params,
    method: HttpMethod,
    files?: APIFile[],
  ) {
    this.token = token;
    this.endpoint = endpoint;
    this.method = method;
    this.files = files;

    // Clear all nullish params
    if (params) {
      if (Array.isArray(params)) {
        this.params = params.filter(param =>
          Object.entries(param).every(([, value]) => value !== undefined && value !== null),
        );
      } else {
        this.params = Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .reduce(
            (params, [key, value]) => ({
              ...params,
              [key]: value,
            }),
            {},
          );
      }
    }
  }

  /**
   * Sends the API request
   * @returns {Promise<Response>}
   */
  public async send(): Promise<Response> {
    const { url, headers } = this;

    const body = await this.body();

    // Adds the headers from the form-data body
    if (body && body instanceof FormData) {
      Object.assign(headers, body.getHeaders());
    }

    return fetch(url, {
      method: this.method,
      body,
      headers,
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
   * @returns {string | Promise<FormData> | undefined}
   */
  private body(): string | Promise<FormData> | undefined {
    // Only return a body if the HTTP method is included in 'bodyMethods'
    if (bodyMethods.includes(this.method) && this.params) {
      return this.files ? this.bodyFiles() : JSON.stringify(this.params);
    }
  }

  /**
   * Returns a form-data body if files need to be sent
   * @returns {Promise<FormData>}
   */
  private async bodyFiles(): Promise<FormData> {
    const { files, params } = this;

    if (!files) throw new Error('No files found!');

    const body = new FormData();

    // Adds all the files to the form-data
    for (const file of files) {
      body.append(file.name, await file.read(), file.name);
    }

    // Adds additional params to the 'payload_json' field
    if (params) {
      body.append('payload_json', JSON.stringify(params));
    }

    return body;
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
    if (this.body() && !this.files) headers[Header.ContentType] = 'application/json';

    return headers;
  }

  /**
   * Parses the given files into {@link APIFile} objects
   * @param {RequestFile[]} files The files
   * @returns {APIFile[] | undefined}
   */
  public static parseFiles(files?: RequestFile[]): APIFile[] | undefined {
    return files?.map(file => new APIFile(file));
  }
}
