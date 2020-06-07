import BaseStruct, { GatewayStruct } from './BaseStruct';
import Bot from './bot/Bot';
import { Snowflake, TEMP } from '../types';

/**
 * User nitro types
 */
enum NitroTypes {
  None,
  NitroClassic,
  Nitro,
}

/**
 * Represents a user in the Discord platform
 * @class
 * @extends BaseStruct
 */
class User extends BaseStruct {
  /**
   * The user's ID
   */
  public id!: Snowflake;

  /**
   * User's username, not unique across the platform
   */
  public username!: string;

  /**
   * User's 4-digit discord-tag
   */
  public hashtag!: string;

  /**
   * User's avatar image. Possibly null if user does not have an avatar image
   */
  public avatar!: string | null;

  /**
   * Whether the user is a bot
   */
  public isBot!: boolean;

  /**
   * Whether the user is an Official Discord System user (part of urgent message system)
   */
  public system: boolean | undefined;

  /**
   * Whether the user has two factor enabled on their account
   */
  public mfaEnabled: boolean | undefined;

  /**
   * The user's chosen language option
   */
  public locale!: string;

  /**
   * Whether the email on this user has been verified
   */
  public verified: boolean | undefined;

  /**
   * The user's email
   */
  public email: string | null | undefined;

  public flags: TEMP | undefined;

  /**
   * {@link NitroTypes} object containing the type of nitro subscription on a user's account
   */
  public nitroType: NitroTypes | undefined;

  public publicFlags!: TEMP;

  constructor(bot: Bot, user: GatewayStruct) {
    super(bot);

    this.init(user);
  }

  /**
   * @ignore
   * @param {GatewayStruct} user The user data
   * @returns {this}
   */
  public init(user: GatewayStruct): this {
    this.id = user.id;
    this.username = user.username;
    this.hashtag = user.discriminator;
    this.avatar = user.avatar;
    this.isBot = user.bot || false;
    this.system = user.system;
    this.mfaEnabled = user.mfa_enabled;
    this.locale = user.locale;
    this.verified = user.verified;
    this.email = user.email;
    this.flags = user.flags;
    this.nitroType = user.premium_type;
    this.publicFlags = user.public_flags;

    return this;
  }

  /**
   * Combines a user's username and hashtag and generates a full name
   * @type {string}
   * @example DiscordUser#0001
   */
  get fullName(): string {
    return `${this.username}#${this.hashtag}`;
  }
}

export default User;