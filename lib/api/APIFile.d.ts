/// <reference types="node" />
import { RequestFile } from './rateLimit';
/**
 * Represents a file sent directly to the API
 */
export declare class APIFile {
    private readonly type;
    readonly path: string;
    readonly name: string;
    constructor(file: RequestFile);
    /**
     * Reads the content of this file as a readable stream
     * @returns {Promise<Stream>}
     */
    read(): Promise<NodeJS.ReadableStream>;
}
