'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
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

  const memberToRemove = await guild.members.get('383614643664584716');

  memberToRemove.remove();
  await bot.events.wait(BotEvent.GuildMemberRemove);

  console.log(
    guild.members.cache.has(memberToRemove.id),
    'whether the member is still in the guild',
    'expected: false',
  ); // expected: false

  const memberToBan = await guild.members.get('219884020601847808');

  memberToBan.ban({ reason: 'This is the reason for the ban!', deleteMessageDays: 2 });
  await bot.events.wait(BotEvent.GuildBanAdd);

  console.log(
    guild.bans.cache.has(memberToBan.id),
    'whether the member is included in the bans cache',
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
