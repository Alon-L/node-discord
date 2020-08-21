'use strict';

import { BotEvent } from '../../src/socket';
import { GuildMembersChunk } from '../../src/socket/handlers/guildMembersChunk';
import { Bot } from '../../src/structures/bot';
import { Guild } from '../../src/structures/guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.GuildMembersChunk,
    (guild: Guild, nonce: string | undefined, chunk: GuildMembersChunk) => {
      console.log(guild.members.cache.size, nonce, chunk);
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
