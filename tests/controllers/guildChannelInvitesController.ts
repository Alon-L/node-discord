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

  channel.invites.create({ unique: true });
  await bot.events.wait(BotEvent.InviteCreate);

  console.log(channel.invites.size, 'the number of cached invites for the channel', 'expected: 1'); // expected: 1

  const invites = await channel.invites.fetchAll();

  console.log(
    channel.invites.size === invites.size,
    'whether the cached invites are up to date',
    'expected: true',
  ); // expected: true

  console.log(channel.invites.size);
})();
