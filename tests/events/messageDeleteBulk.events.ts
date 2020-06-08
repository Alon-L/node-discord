'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import DMChannel from '../../src/structures/channels/DMChannel';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import Message from '../../src/structures/message/Message';
import { Snowflake } from '../../src/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.MessageDeleteBulk,
    (channel: GuildTextChannel | DMChannel, messages: (Message | Snowflake)[]) => {
      console.log(
        channel.id,
        messages.map(message => (message instanceof Message ? `${message.id} - message` : message)),
      );
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
