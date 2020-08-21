'use strict';

import { BotEvent, Permission } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import { PermissionFlags, PermissibleType } from '../../src/structures/flags';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');
  const channel = await guild.channels.get('721781755060813914');

  // Modify the name and topic of the guild channel
  await channel
    .modify({
      name: channel.name + 'a',
      topic: channel.topic ? channel.topic + 'a' : 'a',
    })
    .catch(() => console.log('Rate limit reached for channel modification'));

  // Modify the permissions of the guild channel
  channel.permissions.modify(
    {
      id: bot.user!.id,
      type: PermissibleType.Member,
    },
    {
      allow: PermissionFlags.from(Permission.SendMessages, Permission.AddReactions),
      deny: PermissionFlags.from(Permission.AttachFiles),
    },
  );

  await bot.events.wait(BotEvent.ChannelUpdate);

  console.log(
    channel.permissions.cache.get(bot.user!.id)?.flags.allow.has(Permission.AttachFiles),
    'whether the bot use has the AttachFiles permission',
    'expected: false',
  ); // expected: false

  // Create a new invite in the guild channel
  const invite = await channel.invites.create({
    max: {
      age: 15,
      uses: 3,
    },
    unique: true,
  });

  console.log(invite.code, 'newly generated invite code');

  // Delete the overwritten permissions of the bot's user
  channel.permissions.delete(bot.user!.id);

  await bot.events.wait(BotEvent.ChannelUpdate);

  console.log(
    channel.permissions.cache.has(bot.user!.id),
    'whether a permission overwrite for the bot user exists',
    'expected: false',
  ); // expected: false
})();

bot.events.on(BotEvent.Debug, console.log);
