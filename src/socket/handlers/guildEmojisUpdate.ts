import Cluster from '../../Cluster';
import { GatewayStruct } from '../../structures/BaseStruct';
import Emoji from '../../structures/Emoji';
import Bot from '../../structures/bot/Bot';
import { Snowflake } from '../../types';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, emojis } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const oldEmojis = guild.emojis;

  const newEmojis = new Cluster<Snowflake, Emoji>(
    emojis.map((emoji: GatewayStruct) => [emoji.id, new Emoji(bot, emoji, guild)]),
  );

  guild.emojis = newEmojis;

  bot.events.emit(BotEvents.GuildEmojisUpdate, oldEmojis, newEmojis);
};
