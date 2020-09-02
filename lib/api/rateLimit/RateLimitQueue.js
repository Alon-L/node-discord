"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitQueue = void 0;
/**
 * The rate limit queue
 * Receives all overlapping API requests and ultimately sends them after the the bucket refills
 */
class RateLimitQueue extends Array {
    constructor(bucket) {
        super();
        this.bucket = bucket;
    }
    /**
     * Adds a new API request to the queue and waits until it executes
     * @param {string} endpoint The endpoint for the added API request
     * @param {Params} params The params / body for the added API request
     * @param {RequestFile[]} files The files sent in the API request
     * @returns {Promise<ReturnedData>}
     */
    add(endpoint, params, files) {
        return new Promise(resolve => {
            this.push({
                endpoint,
                params,
                files,
                callback: (data) => {
                    resolve(data);
                },
            });
        });
    }
    /**
     * Frees the queue for the remaining capacity of the bucket
     * @returns {Promise<void>}
     */
    async free() {
        // Runs until either the queue's or the bucket's capacity empties
        while (this.length && this.bucket.remaining && this.bucket.remaining > 0) {
            const nextRequest = this.shift();
            if (!nextRequest)
                break;
            const { endpoint, params, files, callback } = nextRequest;
            // Sends the request
            const data = await this.bucket.send(endpoint, params, files);
            // Executes the callback function
            callback(data);
        }
    }
}
exports.RateLimitQueue = RateLimitQueue;
