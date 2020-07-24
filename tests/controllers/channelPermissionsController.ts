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

  const channel = guild.channels.cache.get('721781755060813914');
  if (!channel) throw new Error('No channels found');

  console.log(channel.permissions.cache.toArrayKeys);

  const permission = channel.permissions.cache.first;

  if (!permission) throw new Error('No first permission key');

  await channel.permissions.delete(permission.id);

  console.log(channel.permissions.cache.toArrayKeys);

  await channel.permissions.modify(permission.permissible, permission.flags);

  console.log(channel.permissions.cache.toArrayKeys);
})();

bot.events.on(BotEvent.Debug, console.log);
