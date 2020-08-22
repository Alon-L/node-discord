'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { User } from '../../src/structures';
import { Member } from '../../src/structures/member';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildMemberRemove, (member: Member | User) => {
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

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
