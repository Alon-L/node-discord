'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, ImageURI } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  guild.emojis.create({ name: 'name', image: new ImageURI('./tests/api/a.png') });
  await bot.events.wait(BotEvent.GuildEmojisUpdate);

  const emoji = await guild.emojis.cache.first;

  if (!emoji) throw new Error('The guild has no emojis!');

  const newName = 'new_emoji_name';

  emoji.modify({ name: 'new_emoji_name' });

  await bot.events.wait(BotEvent.GuildEmojisUpdate);

  console.log(
    guild.emojis.cache.first?.name === newName,
    "the updated guild's name is equal to the given one",
    'expected: true',
  ); // expected: true

  emoji.delete();

  await bot.events.wait(BotEvent.GuildEmojisUpdate);

  console.log(
    guild.emojis.cache.firstKey !== emoji.id,
    'whether the guild emoji was properly deleted',
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
