'use strict';

import { BotEvent } from '../../src/socket/constants';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import GuildUnavailable from '../../src/structures/guild/GuildUnavailable';
import Member from '../../src/structures/member/Member';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildBanAdd, (guild: Guild | GuildUnavailable, member: Member | User) => {
    if (guild instanceof Guild && member instanceof Member) {
      console.log(guild.name, member.nick, member.user?.username);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
