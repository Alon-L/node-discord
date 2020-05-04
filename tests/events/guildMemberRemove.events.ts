'use strict';

import { BotEvents } from '../../src/socket/constants';
import Member from '../../src/structures/Member';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildMemberRemove, (member: Member | User) => {
    if (member instanceof Member) {
      console.log(
        'member of type Member',
        member.id,
        member.user?.username,
        member.nick,
        member.guild.name,
      );
    } else {
      console.log('member of type User', member.id, member.username);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();
