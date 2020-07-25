import { GatewayStruct } from '../../structures/BaseStruct';
import Bot from '../../structures/bot/Bot';
import ControllerCache from '../../structures/controllers/ControllerCache';
import GuildEmoji from '../../structures/guild/GuildEmoji';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, emojis } = d;

  const guild = await bot.guilds.get(guildId);

  const before = guild.emojis.cache;

  const after = new ControllerCache<GuildEmoji>(
    emojis.map((emoji: GatewayStruct) => [emoji.id, new GuildEmoji(bot, emoji, guild)]),
  );

  guild.emojis.cache = after;
  bot.emojis.merge(guild.emojis.cache);

  bot.events.emit(BotEvent.GuildEmojisUpdate, before, after);
};
