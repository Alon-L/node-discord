'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const member = await guild.members.get('247763041888894978');

  const newNick = 'Hello';

  member.modify({ nick: newNick });
  await bot.events.wait(BotEvent.GuildMemberUpdate);

  console.log(
    member.nick === newNick,
    "whether the member's nickname was correctly updated",
    'expected: true',
  ); // expected: true

  const botMember = guild.members.me!;

  const newerNick = newNick + 'a';

  botMember.modifyNickname(newerNick);
  await bot.events.wait(BotEvent.GuildMemberUpdate);

  console.log(
    botMember.nick === newerNick,
    "whether the bot member's nickname was correctly updated",
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
