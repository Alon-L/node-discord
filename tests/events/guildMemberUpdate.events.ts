'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import Member from '../../src/structures/member/Member';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildMemberUpdate, (oldMember: Member, newMember: Member) => {
    console.log(
      oldMember.nick,
      newMember.nick,
      oldMember.roles,
      newMember.roles,
      // These two should be equal to each other if other fields were copied correctly
      oldMember.joinedAt,
      newMember.joinedAt,
    );
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
