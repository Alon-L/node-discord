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

  const invites = await channel.invites.fetchAll();

  if (!invites.first) throw new Error('No invites found in the channel');

  const invite = await guild.invites.fetch(invites.first.code);

  const size = invites.size;

  console.log(
    invite.code === invites.first.code,
    'the fetched code should be the same as the cached one',
    'expected: true',
  ); // expected: true

  guild.invites.delete(invite.code);
  await bot.events.wait(BotEvent.InviteDelete);

  console.log(
    channel.invites.cache.size === guild.invites.cache.size,
    "the channel's fetched invites should be same as the guild's",
    'expected: true',
  ); // expected: true

  console.log(guild.invites.cache.size === size - 1, 'one less cached invite', 'expected: true'); // expected: true
})();
