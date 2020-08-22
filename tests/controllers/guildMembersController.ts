'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const { size } = guild.members.cache;

  const members = await guild.members.fetchSome({ limit: size });

  console.log(
    members.size === size,
    'whether the fetched members quantity matches the requested',
    'expected: true',
  ); // expected: true

  const member = await guild.members.fetch(members.firstKey!);

  console.log(
    member.id === members.firstKey,
    'whether the fetched member is fetched correctly',
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
