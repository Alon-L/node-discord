'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
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

  console.log(channel.name);

  const messages = await channel.messages.fetchSome({ limit: 25 });
  console.log(
    messages.size === 25,
    'whether the fetched messages quantity matches the requested',
    'expected: true',
  ); // expected: true

  const message = await channel.messages.fetch('735248931403071520');
  console.log(message.content);

  // eslint-disable-next-line no-constant-condition
  while (1) {
    await Promise.race([
      bot.events.wait(BotEvent.MessageCreate),
      bot.events.wait(BotEvent.MessageDelete),
    ]);

    console.log(channel.messages.cache.size);
  }
})();
