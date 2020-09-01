import { RateLimitBucket } from './RateLimitBucket';
import { Params, RequestFile, ReturnedData } from './Requests';
/**
 * The items that the rate limit queue stores
 */
export interface RateLimitQueueItem {
    /**
     * The endpoint for this API request
     */
    endpoint: string;
    /**
     * The params / body for this API request
     */
    params: Params;
    /**
     * The files sent in the API request
     */
    files?: RequestFile[];
    /**
     * Callback function to be called whenever the request is made
     * @param {never} data
     */
    callback: (data: never) => void;
}
/**
 * The rate limit queue
 * Receives all overlapping API requests and ultimately sends them after the the bucket refills
 */
export declare class RateLimitQueue extends Array<RateLimitQueueItem> {
    /**
     * The bucket instance that initialized this queue
     */
    private readonly bucket;
    constructor(bucket: RateLimitBucket);
    /**
     * Adds a new API request to the queue and waits until it executes
     * @param {string} endpoint The endpoint for the added API request
     * @param {Params} params The params / body for the added API request
     * @param {RequestFile[]} files The files sent in the API request
     * @returns {Promise<ReturnedData>}
     */
    add<T = ReturnedData | undefined>(endpoint: string, params: Params, files?: RequestFile[]): Promise<T>;
    /**
     * Frees the queue for the remaining capacity of the bucket
     * @returns {Promise<void>}
     */
    free(): Promise<void>;
}
