import { Serializable } from 'child_process';
import { RateLimitBucket } from './RateLimitBucket';
import Cluster from '../../Cluster';
import { Bot } from '../../structures';
import { HttpMethod, Endpoints } from '../endpoints';

/**
 * Rate limit buckets are indexed by the Endpoint Route, Http Method, and all Major Parameters
 * @example
 * [EndpointRoute.Channel, HttpMethod.Get, [channelId]].join(' ');
 */
//export type BucketIndex = [EndpointRoute, HttpMethod, string[]];
export type BucketIndex = string;

/**
 * Dictionary type for request Params and Body
 */
export type Data = Record<string, Serializable | undefined | null>;

/**
 * The type of data returned from the API
 */
export type ReturnedData = Data | Array<Serializable | undefined | null>;

/**
 * The request's Body type
 */
export type Body = Data | Data[];

/**
 * The request's Params type
 */
export type Params = Data | Data[] | undefined;

/**
 * The route's arguments type (as a parameter)
 */
export type RouteArgs = Record<string, string>;

/**
 * All major param keys
 * https://discord.com/developers/docs/topics/rate-limits#rate-limits
 */
const majorKeys: string[] = ['channelId', 'guildId', 'webhookId'];

/**
 * Manager for sending requests according to the Discord API rate limit
 */
export class Requests {
  /**
   * The bot instance
   */
  private readonly bot: Bot;

  /**
   * The Bot's token
   */
  private readonly token: string;

  /**
   * Rate limit buckets are unique identifiers for every API route
   */
  private readonly buckets: Cluster<BucketIndex, RateLimitBucket>;

  constructor(bot: Bot, token: string) {
    this.bot = bot;
    this.token = token;
    this.buckets = new Cluster<BucketIndex, RateLimitBucket>();
  }

  /**
   * Tells the bucket that is responsible for this request to send this request
   * @param {EndpointRoute} route The route this request should go to
   * @param {RouteArgs} routeArgs The arguments this route requires
   * @param {HttpMethod} method The http method for this request
   * @param {Params} params The params / body for this request
   * @returns {Promise<Data>}
   */
  public send<T extends keyof typeof Endpoints>(
    route: T,
    routeArgs: RouteArgs,
    method: HttpMethod,
    params?: Params,
  ): Promise<ReturnedData | undefined> {
    // Retrieve the major params of this request
    const majorParams = this.getMajorParams(routeArgs);

    // Set this bucket's identifier
    const identifier: BucketIndex = [route, method, majorParams].join(' ');

    if (!this.buckets.has(identifier)) {
      // Creates a new bucket if one is not cached
      this.buckets.set(identifier, new RateLimitBucket(this.bot, this.token, route, method));
    }

    const bucket = this.buckets.get(identifier)!;

    // Retrieves this request's endpoint
    const endpoint = Endpoints[route](
      ...(Object.values(routeArgs) as Parameters<typeof Endpoints[T]>),
    );

    // Tells the bucket to send this request
    return bucket.send(endpoint, params);
  }

  /**
   * Retrieves the major params from the route arguments
   * @param {RouteArgs} routeArgs The route arguments
   * @returns {string[]}
   */
  private getMajorParams(routeArgs: RouteArgs): string[] {
    return Object.keys(routeArgs).reduce((keys: string[], key: string) => {
      return majorKeys.includes(key) ? [...keys, key] : keys;
    }, [] as string[]);
  }
}
