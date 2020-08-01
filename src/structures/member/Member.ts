import { MemberPresence } from './MemberPresence';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import { Role } from '../Role';
import { Timestamp } from '../Timestamp';
import { User } from '../User';
import { Bot } from '../bot';
import { Guild, GuildBaseStruct } from '../guild';

/**
 * Options used when modifying a guild member
 */
export interface ModifyMemberOptions {
  /**
   * The value to set the member's nickname to.
   * Requires the {@link Permission.ManageNicknames} permission
   */
  nick?: string;

  /**
   * Array of roles / role IDs to assign to the member.
   * Requires the {@link Permission.ManageRoles} permission
   */
  roles?: (Snowflake | Role)[];

  /**
   * Whether the member should be muted in voice channels.
   * Requires the {@link Permission.MuteMembers} permission
   */
  mute?: boolean;

  /**
   * Whether the member should be deafened in voice channel.
   * Requires the {@link Permission.DeafenMembers} permission
   */
  deaf?: boolean;

  /**
   * The ID of the voice channel to move the member to (if they are connected to another voice channel already).
   * Requires the {@link Permission.MoveMembers} permission
   */
  channelId?: Snowflake;
}

/**
 * Representation of a Discord {@link User} in a guild
 * @extends GuildBaseStruct
 */
export class Member extends GuildBaseStruct {
  /**
   * The member's user ID
   */
  public id!: Snowflake;

  /**
   * The user this guild member represents
   */
  public user: User | undefined;

  /**
   * The user's guild nickname
   */
  public nick!: string | null;

  /**
   * {@link Collection} of all {@link Role}s associated to this member
   */
  public roles!: Collection<Snowflake, Role>;

  /**
   * Timestamp of when the member joined the guild
   */
  public joinedAt!: Timestamp;

  /**
   * Timestamp of when the member start boosting the guild.
   * Possibly null if the user has never boosted this server
   */
  public boostingSince!: Timestamp | null;

  /**
   * Whether the member is deafened in voice channels
   */
  public deaf!: boolean;

  /**
   * Whether the member is muted in voice channels
   */
  public mute!: boolean;

  /**
   * The member's user presence data
   */
  public presence: MemberPresence | undefined;

  constructor(bot: Bot, member: GatewayStruct, guild: Guild, presence?: GatewayStruct) {
    super(bot, guild, member);

    this.init(member, presence);
  }

  /**
   * @ignore
   * @param {GatewayStruct} member The member data
   * @param {GatewayStruct} presence The member presence data
   * @returns {this}
   */
  public init(member: GatewayStruct, presence?: GatewayStruct): this {
    this.id = member.user?.id;
    this.nick = member.nick;

    if (presence) {
      this.presence = new MemberPresence(this.bot, presence, this);

      this.guild.presences.set(this.id, this.presence);
    }

    if (member.user) {
      if (this.bot.users.has(this.id)) {
        // Update the cached user to this member's user
        // Store the cached user in this user field
        this.user = this.bot.users.get(this.id)!.init(member.user);
      } else {
        // Create a new user instance and cache it
        this.user = new User(this.bot, member.user);
        this.bot.users.set(this.id, this.user);
      }
    }

    this.roles = new Collection<Snowflake, Role>(
      this.guild.roles.filter((_r, id) => member.roles?.includes(id)),
    );

    this.joinedAt = new Timestamp(member.joined_at);

    this.boostingSince = member.premium_since ? new Timestamp(member.premium_since) : null;

    this.deaf = member.deaf;
    this.mute = member.mute;

    return this;
  }

  /**
   * Modifies attributes of this member
   * @param {ModifyMemberOptions} options The options to modify for the member
   * @returns {Promise<void>}
   */
  public async modify(options: ModifyMemberOptions): Promise<void> {
    return this.bot.api.modifyGuildMember(this.guild.id, this.id, options);
  }
}
