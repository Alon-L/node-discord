import BaseStruct, { GatewayStruct } from './BaseStruct';
import Bot from './bot/Bot';
import { Snowflake } from '../types';

/**
 * User nitro types
 */
enum NitroTypes {
  None,
  NitroClassic,
  Nitro,
}

class User extends BaseStruct {
  /**
   * The user's ID
   */
  public id: Snowflake;

  /**
   * User's username, not unique across the platform
   */
  public username: string;

  /**
   * User's 4-digit discord-tag
   */
  public hashtag: string;

  /**
   * User's avatar image. Possibly null if user does not have an avatar image
   */
  public avatar: string | null;

  /**
   * Whether the user is a bot
   */
  public isBot?: boolean;

  /**
   * Whether the user is an Official Discord System user (part of urgent message system)
   */
  public system?: boolean;

  /**
   * Whether the user has two factor enabled on their account
   */
  public mfaEnabled?: boolean;

  /**
   * The user's chosen language option
   */
  public locale: string;

  /**
   * Whether the email on this user has been verified
   */
  public verified?: boolean;

  /**
   * The user's email
   */
  public email?: string | null;

  public flags?: undefined;

  /**
   * {@link NitroTypes} object containing the type of nitro subscription on a user's account
   */
  public nitroType?: NitroTypes;

  public publicFlags: undefined;

  constructor(bot: Bot, user?: GatewayStruct) {
    super(bot);

    if (user) {
      this.build(user);
    }
  }

  protected build(user: GatewayStruct): void {
    this.id = user.id;
    this.username = user.username;
    this.hashtag = user.discriminator;
    this.avatar = user.avatar;
    this.isBot = user.bot;
    this.system = user.system;
    this.mfaEnabled = user.mfa_enabled;
    this.locale = user.locale;
    this.verified = user.verified;
    this.email = user.email;
    this.flags = user.flags;
    this.nitroType = user.premium_type;
    this.publicFlags = user.public_flags;
  }
}

export default User;
