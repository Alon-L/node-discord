import RateLimitBucket from './RateLimitBucket';
import { Data, Params } from './Requests';

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
   * Callback function to be called whenever the request is made
   * @param {Data | undefined} data
   */
  callback: (data: Data | undefined) => void;
}

/**
 * The rate limit queue
 * Receives all overlapping API requests and ultimately sends them after the the bucket refills
 */
class RateLimitQueue extends Array<RateLimitQueueItem> {
  /**
   * The bucket instance that initialized this queue
   */
  private readonly bucket: RateLimitBucket;

  constructor(bucket: RateLimitBucket) {
    super();

    this.bucket = bucket;
  }

  /**
   * Adds a new API request to the queue and waits until it executes
   * @param {string} endpoint The endpoint for the added API request
   * @param {Params} params The params / body for the added API request
   * @returns {Promise<Data>}
   */
  add(endpoint: string, params: Params): Promise<Data | undefined> {
    return new Promise<Data>(resolve => {
      this.push({
        endpoint,
        params,
        callback: (data: Data | undefined) => {
          resolve(data);
        },
      });
    });
  }

  /**
   * Frees the queue for the remaining capacity of the bucket
   * @returns {Promise<void>}
   */
  public async free(): Promise<void> {
    // Runs until either the queue's or the bucket's capacity empties
    while (this.length && this.bucket.remaining && this.bucket.remaining > 0) {
      const nextRequest = this.shift();
      if (!nextRequest) break;

      const { endpoint, params, callback } = nextRequest;

      // Sends the request
      const data = await this.bucket.send(endpoint, params);

      // Executes the callback function
      callback(data);
    }
  }
}

export default RateLimitQueue;
