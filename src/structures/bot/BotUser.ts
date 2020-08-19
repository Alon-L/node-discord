import { User } from '../User';

/**
 * Options for when modifying the bot user
 */
export interface ModifyBotUserOptions {
  /**
   * The modified bot user's username. If changed may cause the user's discriminator to be randomized
   */
  username?: string;

  // TODO: avatar field https://discord.com/developers/docs/resources/user#modify-current-user
  /**
   * If passed, modifies the user's avatar
   */
  avatar?: undefined;
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
}
