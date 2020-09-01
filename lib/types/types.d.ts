/**
 * Discord Snowflake.
 * More information can be found here {@link https://discordapp.com/developers/docs/reference#snowflakes}
 */
export declare type Snowflake = string;
export declare type ShardId = number;
/**
 * Turns all fields of a given type to be nullable
 */
export declare type Nullable<T> = {
    [P in keyof T]: T[P] | null;
} | null;
/**
 * Width and height dimensions. Mostly used for images and/or videos
 */
export interface Dimensions {
    height: number;
    width: number;
}
