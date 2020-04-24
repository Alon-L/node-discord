import Bot from './structures/Bot';

export type Snowflake = string;

export type ShardId = number;

export type EventFunction = (bot: Bot, ...args: unknown[]) => unknown;
export type CommandFunction = (bot: Bot, ...args: unknown[]) => unknown;

export interface Command {
  name: string;
  execute: CommandFunction;
}
