/// <reference types="node" />
import { Serializable } from 'child_process';
import { Bot } from '../../bot';
import { HttpMethod } from '../constants';
import { Endpoints } from '../endpoints';
/**
 * Rate limit buckets are indexed by the Endpoint Route, Http Method, and all Major Parameters
 * @example
 * [EndpointRoute.Channel, HttpMethod.Get, [channelId]].join(' ');
 */
export declare type BucketIndex = string;
/**
 * Dictionary type for request Params and Body
 */
export declare type Data = Record<string, Serializable | undefined | null>;
/**
 * The type of data returned from the API
 */
export declare type ReturnedData = Data | Array<Serializable | undefined | null>;
/**
 * The request's Body type
 */
export declare type Body = Data | Data[];
/**
 * The request's Params type
 */
export declare type Params = Data | Data[] | undefined;
/**
 * The route's arguments type (as a parameter)
 */
export declare type RouteArgs = Record<string, string>;
/**
 * Represents a file attachment sent to the API
 */
export declare type RequestFile = {
    path: string;
    name: string;
} | string;
/**
 * Manager for sending requests according to the Discord API rate limit
 */
export declare class Requests {
    /**
     * The bot instance
     */
    private readonly bot;
    /**
     * The Bot's token
     */
    private readonly token;
    /**
     * Rate limit buckets are unique identifiers for every API route
     */
    private readonly buckets;
    constructor(bot: Bot, token: string);
    /**
     * Tells the bucket that is responsible for this request to send this request
     * @param {EndpointRoute} route The route this request should go to
     * @param {RouteArgs} routeArgs The arguments this route requires
     * @param {HttpMethod} method The http method for this request
     * @param {Params} params The params / body for this request
     * @param {RequestFile[]} files The files sent in this request
     * @returns {Promise<TReturn>}
     */
    send<TReturn = ReturnedData | undefined, T extends keyof typeof Endpoints = keyof typeof Endpoints>(route: T, routeArgs: RouteArgs, method: HttpMethod, params?: Params, files?: RequestFile[]): Promise<TReturn>;
    /**
     * Retrieves the major params from the route arguments
     * @param {RouteArgs} routeArgs The route arguments
     * @returns {string[]}
     */
    private getMajorParams;
}
