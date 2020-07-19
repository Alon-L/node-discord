import BaseStruct, { GatewayStruct } from './BaseStruct';
import Timestamp from './Timestamp';
import User from './User';
import Bot from './bot/Bot';
import GuildChannel from './channels/GuildChannel';
import Guild from './guild/Guild';
import { Snowflake } from '../types/types';

export type InviteCode = string;

/**
 * Returned from the {@link INVITE_DELETE} event when the invite has not been cached
 */
export interface PartialInvite {
  /**
   * The ID of the channel this invite is for
   */
  channelId: Snowflake;

  /**
   * The guild this invite is for
   */
  guild: Guild | undefined;

  /**
   * The invite code (unique ID)
   */
  code: InviteCode;
}

export interface InviteMax {
  /**
   * Duration (in seconds) after which the invite expires
   */
  age: number;

  /**
   * Maximum number of times this invite can be used
   */
  uses: number;
}

/**
 * Options used when creating new invites for channels
 */
export interface InviteOptions {
  /**
   * The maximum data for the new invite
   */
  max?: Partial<InviteMax>;

  /**
   * Whether this invite only grants temporary membership
   */
  temporary?: boolean;

  /**
   * If true, don't try to reuse a similar invite (useful for creating many unique one time use invites)
   */
  unique?: boolean;
}

class Invite extends BaseStruct {
  /**
   * The channel this invite is for
   */
  public channel: GuildChannel | undefined;

  /**
   * The invite code (unique ID)
   */
  public code!: InviteCode;

  /**
   * The timestamp of when the invite was created
   */
  public createdAt!: Timestamp;

  /**
   * The guild this invite is for
   */
  public guild: Guild | undefined;

  /**
   * The user who created the invite
   */
  public inviter: User | undefined;

  /**
   * {@link InviteMax} object containing the invite's maximum age and maximum uses
   */
  public max!: InviteMax;

  /**
   * Whether this invite grants temporary membership
   */
  public temporary!: boolean;

  /**
   * Number of times this invite has been used
   */
  public uses!: number;

  constructor(bot: Bot, invite: GatewayStruct) {
    super(bot, invite);

    this.init(invite);
  }

  /**
   * @ignore
   * @param {GatewayStruct} invite The invite data
   * @returns {this}
   */
  public init(invite: GatewayStruct): this {
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

    return this;
  }
}

export default Invite;
