'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { Message } from '../../src/structures/message';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.MessageCreate, (message: Message) => {
    console.log(
      message.id,
      message.author?.id,
      message.channel.type,
      message.mentions.channels,
      message.mentions.channels?.size,
      message.mentions.channels?.toArrayKeys,
      message.mentions.members,
      message.mentions.users,
      message.content,
      message.attachments.first?.dimensions,
      message.embeds,
      message.type,
      message.channel.lastMessageId === message.id,
      message.channel.messages.cache.lastKey === message.id,
    );
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
