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

  const message = await channel.sendMessage('Test message');

  // Validate fetchAll's functionality
  message.react(guild.emojis.cache.first!);

  await bot.events.wait(BotEvent.MessageReactionAdd);

  const reaction = message.reactions.cache.first;

  if (!reaction) throw new Error('Reaction not found!');

  await reaction.users.fetchAll();
  console.log(reaction.users.cache.size, 'number of users that reacted', 'expected: 1'); // expected: 1

  // eslint-disable-next-line no-constant-condition
  while (1) {
    await Promise.race([
      bot.events.wait(BotEvent.MessageReactionAdd),
      bot.events.wait(BotEvent.MessageReactionRemove),
      bot.events.wait(BotEvent.MessageReactionRemoveAll),
      bot.events.wait(BotEvent.MessageReactionRemoveEmoji),
    ]);

    // Expected the size to change based on the event
    console.log(
      typeof message.reactions.cache.first,
      message.reactions.cache.first?.users.cache.size,
    );
  }
})();
