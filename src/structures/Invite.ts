import BaseStruct, { GatewayStruct } from './BaseStruct';
import Timestamp from './Timestamp';
import User from './User';
import Bot from './bot/Bot';
import GuildChannel from './channels/GuildChannel';
import Guild from './guild/Guild';
import { Snowflake } from '../types';

export type InviteCode = string;

/**
 * Returned from the {@link INVITE_DELETE} event when the invite hasn't been fetched yet.
 */
export interface PartialInvite {
  channelId: Snowflake;
  guildId?: Snowflake;
  code: InviteCode;
}

export interface InviteMax {
  age: number;
  uses: number;
}

class Invite extends BaseStruct {
  public channel?: GuildChannel;
  public code: InviteCode;
  public createdAt: Timestamp;
  public guild?: Guild;
  public inviter?: User;
  public max: InviteMax;
  public temporary: boolean;
  public uses: number;

  constructor(bot: Bot, invite: GatewayStruct) {
    super(bot);

    this.code = invite.code;
    this.createdAt = new Timestamp(invite.created_at);

    if (invite.guild_id) {
      this.guild = this.bot.guilds.get(invite.guild_id);
      this.channel = this.guild?.channels.get(invite.channel_id);
    }

    if (invite.inviter) {
      this.inviter = new User(this.bot, invite.inviter);
    }

    this.max = {
      age: invite.max_age,
      uses: invite.max_uses,
    };

    this.temporary = invite.temporary;
    this.uses = invite.uses;
  }
}

export default Invite;
