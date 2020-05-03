'use strict';

import { BotEvents } from '../../src/socket/constants';
import Member from '../../src/structures/Member';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import GuildUnavailable from '../../src/structures/guild/GuildUnavailable';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildBanAdd, (guild: Guild | GuildUnavailable, member: Member | User) => {
    if (guild instanceof Guild && member instanceof Member) {
      console.log(guild.name, member.nick, member.user?.username);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();
