import { GatewayStruct } from './BaseStruct';
import Guild from './Guild';
import GuildBaseStruct from './GuildBaseStruct';
import Role from './Role';
import User from './User';
import Bot from './bot/Bot';
import Cluster from '../Cluster';
import { Snowflake } from '../types';

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
  public joinedAt: number;

  /**
   * Timestamp of when the member start boosting the guild.
   * Possibly null if the user has never boosted this server
   */
  public premiumSince: number | null;

  /**
   * Whether the member is deafened in voice channels
   */
  public deaf: boolean;

  /**
   * Whether the member is muted in voice channels
   */
  public mute: boolean;

  constructor(bot: Bot, member?: GatewayStruct, guild?: Guild) {
    super(bot, guild);

    this.roles = new Cluster<Snowflake, Role>();

    if (member) {
      this.build(member);
    }
  }

  protected build(member: GatewayStruct): void {
    this.user = member.user;
    this.id = member.user?.id;
    this.nick = member.nick;
    this.roles.merge(this.guild.roles.filter((_, id) => member.roles.includes(id)));
    this.joinedAt = member.joined_at;
    this.premiumSince = member.premium_since;
    this.deaf = member.deaf;
    this.mute = member.mute;
  }
}

export default Member;
