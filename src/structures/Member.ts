import { GatewayStruct } from './BaseStruct';
import Role from './Role';
import Timestamp from './Timestamp';
import User from './User';
import Bot from './bot/Bot';
import Guild from './guild/Guild';
import GuildBaseStruct from './guild/GuildBaseStruct';
import Cluster from '../Cluster';
import { Snowflake } from '../types';

/**
 * Representation of a Discord {@link User} in a guild
 * @class
 * @extends GuildBaseStruct
 */
class Member extends GuildBaseStruct {
  /**
   * The member's user ID
   */
  public id: Snowflake;

  /**
   * The user this guild member represents
   */
  public user?: User;

  /**
   * The user's guild nickname
   */
  public nick: string | null;

  /**
   * {@link Cluster} of all {@link Role}s associated to this member
   */
  public roles: Cluster<Snowflake, Role>;

  /**
   * Timestamp of when the member joined the guild
   */
  public joinedAt: Timestamp;

  /**
   * Timestamp of when the member start boosting the guild.
   * Possibly null if the user has never boosted this server
   */
  public premiumSince: Timestamp | null;

  /**
   * Whether the member is deafened in voice channels
   */
  public deaf: boolean;

  /**
   * Whether the member is muted in voice channels
   */
  public mute: boolean;

  constructor(bot: Bot, member: GatewayStruct, guild: Guild) {
    super(bot, guild);

    if (member.user) {
      this.user = new User(this.bot, member.user);
    }

    this.id = member.user?.id;
    this.nick = member.nick;

    this.roles = new Cluster<Snowflake, Role>(
      this.guild.roles.filter((_r, id) => member.roles.includes(id)),
    );

    this.joinedAt = new Timestamp(member.joined_at);

    this.premiumSince = member.premium_since ? new Timestamp(member.premium_since) : null;

    this.deaf = member.deaf;
    this.mute = member.mute;
  }
}

export default Member;
