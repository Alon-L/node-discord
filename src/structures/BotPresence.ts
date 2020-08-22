import { UpdateStatus } from './BotUser';
import { GatewayStruct } from './base';
import { Bot } from '../bot';

/**
 * Represents the bot's presence
 */
export class BotPresence {
  /**
   * The bot instance
   */
  public readonly bot: Bot;

  /**
   * The current bot presence
   */
  public presence: UpdateStatus | undefined;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  /**
   * Modifies the presence of the bot
   * @param {UpdateStatus} presence The new bot presence
   * @returns {void}
   */
  public modify(presence: UpdateStatus): void {
    this.presence = presence;

    return this.bot.connection.modifyPresence(BotPresence.serialize(presence));
  }

  /**
   * Serializes the bot presence into a gateway structure
   * @param {UpdateStatus} presence The bot presence
   * @returns {GatewayStruct}
   */
  private static serialize(presence: UpdateStatus): GatewayStruct {
    return {
      status: presence.status,
      afk: presence.afk || false,
      since: presence.since || null,
      game: presence.game
        ? {
            name: presence.game.name,
            type: presence.game.type,
            url: presence.game.url,
            created_at: presence.game.createdAt,
            timestamps: presence.game.timestamps,
            application_id: presence.game.applicationId,
            details: presence.game.details,
            state: presence.game.state,
            emoji: presence.game.emoji,
            party: presence.game.party,
            assets: presence.game.assets && {
              large_image: presence.game.assets.largeImage,
              large_text: presence.game.assets.largeText,
              small_image: presence.game.assets.smallImage,
              small_text: presence.game.assets.smallText,
            },
            secrets: presence.game.secrets,
            instance: presence.game.instance,
            flags: presence.game.flags?.bits,
          }
        : null,
    };
  }
}
