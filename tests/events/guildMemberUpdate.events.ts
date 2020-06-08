'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Member from '../../src/structures/member/Member';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildMemberUpdate, (before: Member, after: Member) => {
    console.log(
      before.nick,
      after.nick,
      before.roles,
      after.roles,
      // These two should be equal to each other if other fields were copied correctly
      before.joinedAt,
      after.joinedAt,
    );
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
