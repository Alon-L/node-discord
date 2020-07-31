'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const channel = await guild.channels.get('702476896008405005');

  channel.invites.create({ unique: true });
  await bot.events.wait(BotEvent.InviteCreate);

  console.log(
    channel.invites.cache.size,
    'the number of cached invites for the channel',
    'expected: 1',
  ); // expected: 1

  const invites = await channel.invites.fetchAll();

  console.log(
    channel.invites.cache.size === invites.size,
    'whether the cached invites are up to date',
    'expected: true',
  ); // expected: true

  console.log(channel.invites.cache.size);
})();
