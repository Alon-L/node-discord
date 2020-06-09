import Bot from './structures/bot/Bot';
import DMChannel from './structures/channels/DMChannel';
import GuildTextChannel from './structures/channels/GuildTextChannel';

/**
 * Discord Snowflake.
 * More information can be found here {@link https://discordapp.com/developers/docs/reference#snowflakes}
 */
export type Snowflake = string;

export type ShardId = number;

/**
 * Turns all fields of a given type to be nullable
 */
export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

/**
 * Width and height dimensions. Mostly used for images and/or videos
 */
export interface Dimensions {
  height: number;
  width: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventFunction = (...args: any[]) => void;
export type CommandFunction = (bot: Bot, ...args: unknown[]) => unknown;

export interface Command {
  name: string;
  execute: CommandFunction;
}

export type TextBasedChannel = GuildTextChannel | DMChannel;
