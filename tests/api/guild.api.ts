'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  console.log(guild);

  const oldSystemChannelId = guild.systemChannel.channel?.id;

  guild.modify({
    systemChannelId: '721781755060813914',
  });

  await bot.events.wait(BotEvent.GuildUpdate);

  console.log(
    guild.systemChannel.channel?.id === '721781755060813914',
    'systemChannel updated',
    'expected: true',
  ); // expected: true

  // Revert the change
  await guild.modify({
    systemChannelId: oldSystemChannelId,
  });
})();

bot.events.on(BotEvent.Debug, console.log);
