'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { User, TextBasedChannel } from '../../src/structures';
import { Member } from '../../src/structures/member';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.TypingStart,
    (channel: TextBasedChannel | undefined, user: Member | User | undefined, startedAt: number) => {
      console.log(channel?.id, user?.id, startedAt);
      if (user instanceof Member) {
        console.log(user.guild.id, user.nick);
      } else {
        console.log(user?.username, user?.hashtag);
      }
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
