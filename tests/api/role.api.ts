'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const role = guild.roles.cache.get('745317646811136020')!;
  const newName = role.name + 'a';

  role.modify({ name: newName });
  await bot.events.wait(BotEvent.GuildRoleUpdate);

  console.log(role.name === newName, 'whether the role name was modified', 'expected: true'); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
