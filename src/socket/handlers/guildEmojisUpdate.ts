import { Bot } from '../../bot';
import { GatewayStruct } from '../../structures/base';
import { ControllerCache } from '../../structures/controllers';
import { GuildEmoji } from '../../structures/guild';
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
