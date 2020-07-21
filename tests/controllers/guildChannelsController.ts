'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = bot.guilds.first;
  if (!guild) throw new Error('No guilds found');

  const channel = guild.channels.cache.first;
  if (!channel) throw new Error('No channels found');

  console.log(channel.id);
  console.log((await guild.channels.fetch(channel.id)).id);
  console.log((await guild.channels.getOrFetch(channel.id)).id);

  // eslint-disable-next-line no-constant-condition
  while (1) {
    await Promise.race([
      bot.events.wait(BotEvent.ChannelCreate),
      bot.events.wait(BotEvent.ChannelDelete),
    ]);

    // Compare all the guild's cached channels to all the bot's cached channels
    // Both should be equal on guild channel modifications
    console.log(
      bot.guilds.toArray.reduce(
        (channels: number, guilds: Guild) => channels + guilds.channels.cache.size,
        0,
      ),
      bot.channels.cache.size,
    );
  }
})();
