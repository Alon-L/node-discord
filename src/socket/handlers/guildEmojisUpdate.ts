import Cluster from '../../Cluster';
import { GatewayStruct } from '../../structures/BaseStruct';
import Emoji from '../../structures/Emoji';
import Bot from '../../structures/bot/Bot';
import { Snowflake } from '../../types';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const oldEmojis = guild.emojis;

  const newEmojis = new Cluster<Snowflake, Emoji>(
    d.emojis.map((emoji: GatewayStruct) => [emoji.id, new Emoji(bot, emoji, guild)]),
  );

  guild.emojis = newEmojis;

  bot.events.emit(BotEvents.GuildEmojisUpdate, oldEmojis, newEmojis);
};

export const name = GatewayEvents.GuildEmojisUpdate;
