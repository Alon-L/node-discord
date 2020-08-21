import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { ImageURI } from '../ImageURI';
import { User } from '../User';
import { PermissionFlags } from '../flags';

/**
 * Options for when modifying the bot user
 */
export interface ModifyBotUserOptions {
  /**
   * The modified bot user's username. If changed may cause the user's discriminator to be randomized
   */
  username?: string;

  /**
   * If passed, modifies the user's avatar.
   * Path to the new user's avatar image
   */
  avatar?: ImageURI | null;
}

/**
 * Options for when fetching guilds using the bot's user
 */
export interface FetchGuildsOptions {
  /**
   * Fetch guilds before this guild ID
   */
  before?: Snowflake;

  /**
   * Fetch guilds after this guild ID
   */
  after?: Snowflake;

  /**
   * Max number of guilds to return (1-100)
   * @default 100
   */
  limit?: number;
}

/**
 * Partial guild object
 */
export interface PartialGuild {
  /**
   * The ID of the guild
   */
  id: Snowflake;

  /**
   * The name of the guild
   */
  name: string;

  /**
   * The icon hash of the guild
   */
  icon: string;

  /**
   * Whether the bot user is the owner of the guild
   */
  owner: boolean;

  /**
   * The permissions for the bot in this guild
   */
  permissions: PermissionFlags;
}

/**
 * Represents the bot's user account
 */
export class BotUser extends User {
  /**
   * Modifies this bot's user account settings
   * @param {ModifyBotUserOptions} options The options for the modified bot user
   * @returns {Promise<BotUser>}
   */
  public modify(options: ModifyBotUserOptions): Promise<BotUser> {
    return this.bot.api.modifyBotUser(options);
  }

  /**
   * Fetches the guilds the bot user is a member of
   * @param {FetchGuildsOptions} options The options for the fetch operation
   * @returns {Promise<Collection<Snowflake, PartialGuild>>}
   */
  public fetchGuilds(options?: FetchGuildsOptions): Promise<Collection<Snowflake, PartialGuild>> {
    return this.bot.api.fetchBotGuilds(options);
  }

  /**
   * Leaves a guild by its ID
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<void>}
   */
  public leaveGuild(guildId: Snowflake): Promise<void> {
    return this.bot.api.leaveGuild(guildId);
  }
}
