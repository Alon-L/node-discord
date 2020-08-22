'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { ChannelType, GuildChannel, GuildTextChannel } from '../../src/structures/channels';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const channel = guild.channels.cache.filter<GuildTextChannel>(
    (channel: GuildChannel) => channel.type === ChannelType.GuildText,
  ).first;
  if (!channel) throw new Error('No channels found');

  const message = await channel.sendMessage('Test message');

  // eslint-disable-next-line no-constant-condition
  while (1) {
    await Promise.race([
      bot.events.wait(BotEvent.MessageReactionAdd),
      bot.events.wait(BotEvent.MessageReactionRemove),
      bot.events.wait(BotEvent.MessageReactionRemoveAll),
      bot.events.wait(BotEvent.MessageReactionRemoveEmoji),
    ]);

    console.log(message.reactions.cache.size);
  }
})();
