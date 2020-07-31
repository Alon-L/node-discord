'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, User, Member } from '../../src/structures';
import { Guild, GuildUnavailable } from '../../src/structures/guild';
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
