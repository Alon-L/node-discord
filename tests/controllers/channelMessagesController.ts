'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import { ChannelType } from '../../src/structures/channels/Channel';
import GuildChannel from '../../src/structures/channels/GuildChannel';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = bot.guilds.get('702476896008405002');
  if (!guild) throw new Error('No guilds found');

  const channel = guild.channels.cache.filter(
    (channel: GuildChannel) => channel.type === ChannelType.GuildText,
  ).first as GuildTextChannel;
  if (!channel) throw new Error('No channels found');

  console.log(channel.name);

  const message = await channel.messages.fetch('735235254356279358');
  console.log(message.content);

  // eslint-disable-next-line no-constant-condition
  while (1) {
    await Promise.race([
      bot.events.wait(BotEvent.MessageCreate),
      bot.events.wait(BotEvent.MessageDelete),
    ]);

    console.log(channel.messages.size);
  }
})();
