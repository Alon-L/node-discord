'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = bot.guilds.get('702476896008405002');
  if (!guild) throw new Error('No guilds found');

  const channel = guild.channels.get('702476896008405005');
  if (!channel) throw new Error('No channels found');

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
    channel.invites.size === guild.invites.size,
    "the channel's fetched invites should be same as the guild's",
    'expected: true',
  ); // expected: true

  console.log(guild.invites.size === size - 1, 'one less cached invite', 'expected: true'); // expected: true
})();
