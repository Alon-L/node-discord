'use strict';

import { BotEvents } from '../../src/socket/constants';
import Member from '../../src/structures/Member';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildMemberAdd, (member: Member) => {
    console.log(member.id, member.user?.username, member.nick, member.guild.name);
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
