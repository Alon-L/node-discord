import { Response } from 'node-fetch';
import { APIFile } from './APIFile';
import { HttpMethod } from './constants';
import { Params, RequestFile } from './rateLimit';
/**
 * Enum containing common request headers
 */
export declare enum Header {
    ContentType = "content-type"
}
/**
 * Creates and sends an HTTP request to Discord's API
 */
export declare class APIRequest {
    private readonly token;
    private readonly endpoint;
    private readonly params;
    private readonly method;
    private readonly files;
    constructor(token: string, endpoint: string, params: Params, method: HttpMethod, files?: APIFile[]);
    /**
     * Sends the API request
     * @returns {Promise<Response>}
     */
    send(): Promise<Response>;
    /**
     * Returns the full URL after adding the parameters if required
     * @type {string}
     */
    private get url();
    /**
     * Returns the body of the request
     * @returns {string | Promise<FormData> | undefined}
     */
    private body;
    /**
     * Returns a form-data body if files need to be sent
     * @returns {Promise<FormData>}
     */
    private bodyFiles;
    /**
     * Returns the headers required for the request
     * @type {Record<string, string>}
     */
    private get headers();
    /**
     * Parses the given files into {@link APIFile} objects
     * @param {RequestFile[]} files The files
     * @returns {APIFile[] | undefined}
     */
    static parseFiles(files?: RequestFile[]): APIFile[] | undefined;
}
