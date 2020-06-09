'use strict';

import { BotEvents } from '../../src/socket/constants';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import Member from '../../src/structures/member/Member';
import { TextBasedChannel } from '../../src/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.TypingStart,
    (channel: TextBasedChannel | undefined, user: Member | User, startedAt: number) => {
      console.log(channel?.id, user.id, startedAt);
      if (user instanceof Member) {
        console.log(user.guild.id, user.nick);
      } else {
        console.log(user.username, user.hashtag);
      }
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
