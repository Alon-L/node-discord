"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIRequest = exports.Header = void 0;
const querystring_1 = __importDefault(require("querystring"));
const form_data_1 = __importDefault(require("form-data"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const APIFile_1 = require("./APIFile");
const constants_1 = require("./constants");
const paramsMethods = [constants_1.HttpMethod.Get];
const bodyMethods = [constants_1.HttpMethod.Post, constants_1.HttpMethod.Patch, constants_1.HttpMethod.Put];
/**
 * Enum containing common request headers
 */
var Header;
(function (Header) {
    Header["ContentType"] = "content-type";
})(Header = exports.Header || (exports.Header = {}));
/**
 * Creates and sends an HTTP request to Discord's API
 */
class APIRequest {
    constructor(token, endpoint, params, method, files) {
        this.token = token;
        this.endpoint = endpoint;
        this.method = method;
        this.files = files;
        // Clear all nullish params
        if (params) {
            if (Array.isArray(params)) {
                this.params = params.filter(param => Object.entries(param).every(([, value]) => value !== undefined && value !== null));
            }
            else {
                this.params = Object.entries(params)
                    .filter(([, value]) => value !== undefined)
                    .reduce((params, [key, value]) => ({
                    ...params,
                    [key]: value,
                }), {});
            }
        }
    }
    /**
     * Sends the API request
     * @returns {Promise<Response>}
     */
    async send() {
        const { url, headers } = this;
        const body = await this.body();
        // Adds the headers from the form-data body
        if (body && body instanceof form_data_1.default) {
            Object.assign(headers, body.getHeaders());
        }
        return node_fetch_1.default(url, {
            method: this.method,
            body,
            headers,
        });
    }
    /**
     * Returns the full URL after adding the parameters if required
     * @type {string}
     */
    get url() {
        let url = `${constants_1.baseURL}${this.endpoint}`;
        // Add the parameters to the URL if the HTTP method is included in 'paramsMethods'
        if (this.params && paramsMethods.includes(this.method) && Object.keys(this.params).length) {
            url += `?${querystring_1.default.encode(this.params)}`;
        }
        return url;
    }
    /**
     * Returns the body of the request
     * @returns {string | Promise<FormData> | undefined}
     */
    body() {
        // Only return a body if the HTTP method is included in 'bodyMethods'
        if (bodyMethods.includes(this.method) && this.params) {
            return this.files ? this.bodyFiles() : JSON.stringify(this.params);
        }
    }
    /**
     * Returns a form-data body if files need to be sent
     * @returns {Promise<FormData>}
     */
    async bodyFiles() {
        const { files, params } = this;
        if (!files)
            throw new Error('No files found!');
        const body = new form_data_1.default();
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
    get headers() {
        // Default headers required for every request
        const headers = {
            'X-RateLimit-Precision': 'millisecond',
            Authorization: `Bot ${this.token}`,
        };
        // Adds the Content-Type header if the request contains a body
        if (this.body() && !this.files)
            headers[Header.ContentType] = 'application/json';
        return headers;
    }
    /**
     * Parses the given files into {@link APIFile} objects
     * @param {RequestFile[]} files The files
     * @returns {APIFile[] | undefined}
     */
    static parseFiles(files) {
        return files === null || files === void 0 ? void 0 : files.map(file => new APIFile_1.APIFile(file));
    }
}
exports.APIRequest = APIRequest;
