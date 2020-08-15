import { Guild } from './Guild';
import { GuildBaseStruct } from './GuildBaseStruct';
import { GatewayStruct } from '../BaseStruct';
import { User } from '../User';
import { Bot } from '../bot';

/**
 * Represents a user ban in a guild
 */
export class GuildBan extends GuildBaseStruct {
  /**
   * The reason for the guild.
   * Possibly undefined if no reason was specified
   */
  public reason: string | undefined;

  /**
   * The user banned from the guild
   */
  public user!: User;

  constructor(bot: Bot, ban: GatewayStruct, guild: Guild) {
    super(bot, guild, ban);

    this.init(ban);
  }

  /**
   * @ignore
   * @param {GatewayStruct} ban The ban data
   * @returns {this}
   */
  public init(ban: GatewayStruct): this {
    this.reason = ban.reason;
    this.user = this.bot.users.get(ban.user.id) || new User(this.bot, ban.user);

    return this;
  }
}
