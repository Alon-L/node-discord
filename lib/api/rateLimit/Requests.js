"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Requests = void 0;
const RateLimitBucket_1 = require("./RateLimitBucket");
const Collection_1 = __importDefault(require("../../Collection"));
const endpoints_1 = require("../endpoints");
/**
 * All major param keys
 * https://discord.com/developers/docs/topics/rate-limits#rate-limits
 */
const majorKeys = ['channelId', 'guildId', 'webhookId'];
/**
 * Manager for sending requests according to the Discord API rate limit
 */
class Requests {
    constructor(bot, token) {
        this.bot = bot;
        this.token = token;
        this.buckets = new Collection_1.default();
    }
    /**
     * Tells the bucket that is responsible for this request to send this request
     * @param {EndpointRoute} route The route this request should go to
     * @param {RouteArgs} routeArgs The arguments this route requires
     * @param {HttpMethod} method The http method for this request
     * @param {Params} params The params / body for this request
     * @param {RequestFile[]} files The files sent in this request
     * @returns {Promise<TReturn>}
     */
    send(route, routeArgs, method, params, files) {
        // Retrieve the major params of this request
        const majorParams = this.getMajorParams(routeArgs);
        // Set this bucket's identifier
        const identifier = [route, method, majorParams].join(' ');
        if (!this.buckets.has(identifier)) {
            // Creates a new bucket if one is not cached
            this.buckets.set(identifier, new RateLimitBucket_1.RateLimitBucket(this.bot, this.token, route, method));
        }
        const bucket = this.buckets.get(identifier);
        // Retrieves this request's endpoint
        const endpoint = endpoints_1.Endpoints[route](...Object.values(routeArgs));
        // Tells the bucket to send this request
        return bucket.send(endpoint, params, files);
    }
    /**
     * Retrieves the major params from the route arguments
     * @param {RouteArgs} routeArgs The route arguments
     * @returns {string[]}
     */
    getMajorParams(routeArgs) {
        return Object.keys(routeArgs).reduce((keys, key) => {
            return majorKeys.includes(key) ? [...keys, key] : keys;
        }, []);
    }
}
exports.Requests = Requests;
