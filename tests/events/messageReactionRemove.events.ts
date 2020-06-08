'use strict';

import { BotEvents } from '../../src/socket/constants';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import Member from '../../src/structures/member/Member';
import MessageReaction from '../../src/structures/message/MessageReaction';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.MessageReactionRemove,
    (reaction: MessageReaction, user: Member | User | undefined) => {
      console.log(reaction.emoji.name, user?.id, reaction.message.reactions.toArrayKeys);
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
