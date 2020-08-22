'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { Timestamp } from '../../src/structures';
import { GuildTextChannel } from '../../src/structures/channels';
import { TextBasedChannel } from '../../src/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.ChannelPinsUpdate,
    (channel: TextBasedChannel, oldPinTimestamp: Timestamp | undefined) => {
      if (channel instanceof GuildTextChannel) {
        console.log(channel.name);
      }
      console.log(channel.type, Date.now());
      console.log('old', oldPinTimestamp?.unix());
      console.log('new', channel.pins.lastPinTimestamp?.unix());
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
