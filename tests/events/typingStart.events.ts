'use strict';

import { BotEvents } from '../../src/socket/constants';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import DMChannel from '../../src/structures/channels/DMChannel';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import Member from '../../src/structures/member/Member';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.TypingStart,
    (channel: GuildTextChannel | DMChannel | undefined, user: Member | User, startedAt: number) => {
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
