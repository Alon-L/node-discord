'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');
  const member = await guild.members.me!;

  const roleId = guild.roles.cache.get('744174116772249610')!.id;

  console.log(roleId);

  member.roles.add(roleId);
  await bot.events.wait(BotEvent.GuildMemberUpdate);

  console.log(member.roles.cache.has(roleId), 'whether the member has the role', 'expected: true'); // expected: true

  member.roles.remove(roleId);
  await bot.events.wait(BotEvent.GuildMemberUpdate);

  console.log(member.roles.cache.has(roleId), 'whether the member has the role', 'expected: false'); // expected: false
})();

bot.events.on(BotEvent.Debug, console.log);
