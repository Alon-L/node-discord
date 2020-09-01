"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitBucket = exports.ValidCodes = void 0;
const util_1 = __importDefault(require("util"));
const RateLimitQueue_1 = require("./RateLimitQueue");
const APIRequest_1 = require("../APIRequest");
const endpoints_1 = require("../endpoints");
exports.ValidCodes = [endpoints_1.StatusCode.OK, endpoints_1.StatusCode.Created, endpoints_1.StatusCode.NoContent];
class RateLimitBucket {
    constructor(bot, token, route, method) {
        this.bot = bot;
        this.token = token;
        this.queue = new RateLimitQueue_1.RateLimitQueue(this);
        this.route = route;
        this.method = method;
        /*
         Initialize the number of remaining requests to 1
         in order to determine the 'limit' and 'remaining' values after sending the first request.
         */
        this.remaining = 1;
    }
    /**
     * Creates a new API request and sends it if the bucket is capable of doing so
     * @param {string} endpoint The request endpoint
     * @param {Params} params The request params / body
     * @param {RequestFile[]} files The files sent in this request
     * @returns {Promise<ReturnedData | undefined>}
     */
    send(endpoint, params, files) {
        return __awaiter(this, void 0, void 0, function* () {
            // The rate limit is reached. Add request to the queue
            if (this.remaining !== undefined && this.remaining <= 0) {
                this.bot.debug(`You reached the rate limit for ${endpoint}. Your request will still go through, but make sure you don't do this again!`);
                return this.queue.add(endpoint, params, files);
            }
            // Decrements the remaining number of requests (to later be updated by the fixed value)
            if (this.remaining) {
                this.remaining--;
            }
            // Creates a new API request
            const apiRequest = new APIRequest_1.APIRequest(this.token, endpoint, params, this.method, APIRequest_1.APIRequest.parseFiles(files));
            const response = yield apiRequest.send();
            // Sets the rate limit information given from the response's headers
            this.setLimits(response.headers);
            const json = response.status !== endpoints_1.StatusCode.NoContent
                ? (yield response.json())
                : undefined;
            if (json) {
                // Validates the response before proceeding
                this.validateResponse(response, json);
            }
            return json;
        });
    }
    /**
     * Refill this bucket
     */
    refillBucket() {
        return __awaiter(this, void 0, void 0, function* () {
            // Set the remaining number of requests in this bucket back to its limit
            this.remaining = this.limit;
            // Delete the stored setTimeout function
            this.timeout = undefined;
            // Empties the queue
            yield this.queue.free();
        });
    }
    /**
     * Validates the response. Throws an error in case it is not valid
     * @param {Response} response The response received from sending an API request
     * @param {ReturnedData} json The parsed response in JSON
     */
    validateResponse(response, json) {
        switch (response.status) {
            case endpoints_1.StatusCode.UnAuthorized:
                this.bot.connection.disconnectAll(4004 /* AuthenticationFailed */);
                throw new Error('Your Bot token is invalid! This connection has been terminated');
            case endpoints_1.StatusCode.Forbidden:
                throw new Error(`The request to ${response.url} was rejected to to insufficient bot permissions`);
            case endpoints_1.StatusCode.TooManyRequests:
                throw new Error("You have reached Discord's API rate limit. Please slow down");
        }
        if (!exports.ValidCodes.includes(response.status)) {
            // Debug the json response
            this.bot.debug('Error!', json);
            if (Array.isArray(json)) {
                throw new TypeError(`${response.url} - an error has occurred with an array response type - ${util_1.default.inspect(json)}`);
            }
            else {
                throw new Error(`${response.url} (${response.status} code) - ${json.message || json.content || util_1.default.inspect(json)}`);
            }
        }
    }
    // TODO: Global rate limit
    /**
     * Sets the rate limit information given from the response's headers
     * @param {Headers} headers The response's headers
     */
    setLimits(headers) {
        // Retrieve all the rate limit information from the request headers
        const remaining = headers.get(endpoints_1.RateLimitHeaders.Remaining);
        const limit = headers.get(endpoints_1.RateLimitHeaders.Limit);
        const reset = headers.get(endpoints_1.RateLimitHeaders.Reset);
        const resetAfter = headers.get(endpoints_1.RateLimitHeaders.ResetAfter);
        // Set the parsed value of the rate limit information
        // Use the cached remaining number if this is not the first request for async requests
        this.remaining = this.limit ? this.remaining : remaining ? parseInt(remaining) : undefined;
        this.limit = limit ? parseInt(limit) : undefined;
        this.reset = reset ? parseFloat(reset) : undefined;
        if (!this.reset && !resetAfter)
            return;
        // Initialize the timeout for the bucket's refill if one hasn't been initialized before
        if (!this.timeout) {
            // The timeout until the bucket refills
            const refillTimeout = ((resetAfter && parseFloat(resetAfter)) || Date.now() - this.reset) * 1000;
            this.timeout = setTimeout(this.refillBucket.bind(this), refillTimeout);
        }
    }
}
exports.RateLimitBucket = RateLimitBucket;
