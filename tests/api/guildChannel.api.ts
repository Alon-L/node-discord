'use strict';

import { BotEvent, Permission } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import PermissionFlags, { PermissibleType } from '../../src/structures/flags/PermissionFlags';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guildChannel = bot.guilds
    .get('702476896008405002')
    ?.channels.cache.get('721781755060813914');
  if (!guildChannel) return;

  // Modify the name and topic of the guild channel
  await guildChannel
    .modify({
      name: guildChannel.name + 'a',
      topic: guildChannel.topic ? guildChannel.topic + 'a' : 'a',
    })
    .catch(() => console.log('Rate limit reached for channel modification'));

  // Modify the permissions of the guild channel
  guildChannel.permissions.modify(
    {
      id: bot.user!.id,
      type: PermissibleType.Member,
    },
    {
      allow: PermissionFlags.build(Permission.SendMessages, Permission.AddReactions),
      deny: PermissionFlags.build(Permission.AttachFiles),
    },
  );

  await bot.events.wait(BotEvent.ChannelUpdate);

  console.log(
    guildChannel.permissions.cache.get(bot.user!.id)?.flags.allow.has(Permission.AttachFiles),
    'whether the bot use has the AttachFiles permission',
    'expected: false',
  ); // expected: false

  // Create a new invite in the guild channel
  const invite = await guildChannel.invites.create({
    max: {
      age: 15,
      uses: 3,
    },
    unique: true,
  });

  console.log(invite.code, 'newly generated invite code');

  // Delete the overwritten permissions of the bot's user
  guildChannel.permissions.delete(bot.user!.id);

  await bot.events.wait(BotEvent.ChannelUpdate);

  console.log(
    guildChannel.permissions.cache.has(bot.user!.id),
    'whether a permission overwrite for the bot user exists',
    'expected: false',
  ); // expected: false
})();

bot.events.on(BotEvent.Debug, console.log);
