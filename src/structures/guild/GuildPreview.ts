import { GuildApproximates } from './Guild';
import { GuildFeature } from '../../socket/constants';
import { Snowflake } from '../../types/types';
import Avatar, { GuildDiscoverySplashFormat, GuildIconFormat, GuildSplashFormat } from '../Avatar';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';

class GuildPreview extends BaseStruct {
  /**
   * Guild ID
   */
  public id!: Snowflake;

  /**
   * Guild name
   */
  public name!: string;

  /**
   * Guild icon hash. Possibly null if guild does not have an icon
   */
  public iconHash!: string | null;

  /**
   * Guild splash image hash. Possibly null if guild does not have a splash image
   */
  public splashHash!: string | null;

  /**
   * Guild discovery splash image hash. Possibly null if guild does not have a discovery splash image
   */
  public discoverySplashHash!: string | null;

  /**
   * Enabled guild features
   */
  public features!: GuildFeature[];

  /**
   * Information about approximated data for this guild
   */
  public approximates!: GuildApproximates;

  constructor(bot: Bot, preview: GatewayStruct) {
    super(bot, preview);

    this.init(preview);
  }

  public init(preview: GatewayStruct): this {
    this.id = preview.id;
    this.name = preview.name;
    this.iconHash = preview.icon;
    this.splashHash = preview.splash;
    this.discoverySplashHash = preview.discovery_splash;
    this.features = preview.features;

    this.approximates = {
      memberCount: preview.approximate_member_count,
      presenceCount: preview.approximate_presence_count,
    };

    return this;
  }

  /**
   * Returns the URL of the guild's icon image.
   * Possibly returns null if the guild does not have an icon
   * @param {GuildIconFormat} format The format of the returned guild icon image
   * @param {number} size The size of the returned guild icon image
   * @returns {string | null}
   */
  public iconURL(format: GuildIconFormat = GuildIconFormat.PNG, size?: number): string | null {
    return this.iconHash && Avatar.guildURL(this.iconHash, this.id, format, size);
  }

  /**
   * Returns the URL of the guild's splash image.
   * Possibly returns null if the guild does not have a splash image
   * @param {GuildSplashFormat} format The format of the returned guild splash image
   * @param {number} size The size of the returned guild splash image
   * @returns {string | null}
   */
  public splashURL(
    format: GuildSplashFormat = GuildSplashFormat.PNG,
    size?: number,
  ): string | null {
    return this.splashHash && Avatar.splashURL(this.splashHash, this.id, format, size);
  }

  /**
   * Returns the URL of the guild's discovery splash image.
   * Possibly returns null if the guild does not have a discovery splash image
   * @param {GuildDiscoverySplashFormat} format The format of the returned guild discovery splash image
   * @param {number} size The size of the returned guild discovery splash image
   * @returns {string | null}
   */
  public discoverySplashURL(
    format: GuildDiscoverySplashFormat = GuildDiscoverySplashFormat.PNG,
    size?: number,
  ): string | null {
    return (
      this.discoverySplashHash &&
      Avatar.discoverySplashURL(this.discoverySplashHash, this.id, format, size)
    );
  }
}

export default GuildPreview;
