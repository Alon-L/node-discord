'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { User } from '../../src/structures';
import { Member } from '../../src/structures/member';
import { MessageReaction } from '../../src/structures/message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.MessageReactionRemove,
    (reaction: MessageReaction, user: Member | User | undefined) => {
      console.log(reaction.emoji.name, user?.id, reaction.message.reactions.cache.toArrayKeys);
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
