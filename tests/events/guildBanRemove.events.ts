'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, User } from '../../src/structures';
import { Guild, GuildUnavailable } from '../../src/structures/guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildBanRemove, (guild: Guild | GuildUnavailable, user: User) => {
    if (guild instanceof Guild) {
      console.log(guild.name, user.username);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
