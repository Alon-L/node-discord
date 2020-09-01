import { Params, RequestFile, ReturnedData } from './Requests';
import { Bot } from '../../bot';
import { HttpMethod } from '../constants';
import { StatusCode, EndpointRoute } from '../endpoints';
export declare const ValidCodes: StatusCode[];
export declare class RateLimitBucket {
    /**
     * The bot instance
     */
    private readonly bot;
    /**
     * The bot's token
     */
    private readonly token;
    /**
     * The queue associated to this bucket
     */
    private readonly queue;
    /**
     * The route this bucket references
     */
    private readonly route;
    /**
     * The HTTP method this bucket references
     */
    private readonly method;
    /**
     * The number of remaining requests this bucket has until the next reset {@link reset}
     */
    remaining: number | undefined;
    /**
     * The number of total requests that can be made
     */
    private limit;
    /**
     * The Unix timestamp of the next refill for this bucket
     */
    private reset;
    /**
     * The current setTimeout that will run once the next refill is reached
     */
    private timeout;
    constructor(bot: Bot, token: string, route: EndpointRoute, method: HttpMethod);
    /**
     * Creates a new API request and sends it if the bucket is capable of doing so
     * @param {string} endpoint The request endpoint
     * @param {Params} params The request params / body
     * @param {RequestFile[]} files The files sent in this request
     * @returns {Promise<ReturnedData | undefined>}
     */
    send<T = ReturnedData | undefined>(endpoint: string, params: Params, files?: RequestFile[]): Promise<T>;
    /**
     * Refill this bucket
     */
    private refillBucket;
    /**
     * Validates the response. Throws an error in case it is not valid
     * @param {Response} response The response received from sending an API request
     * @param {ReturnedData} json The parsed response in JSON
     */
    private validateResponse;
    /**
     * Sets the rate limit information given from the response's headers
     * @param {Headers} headers The response's headers
     */
    private setLimits;
}
