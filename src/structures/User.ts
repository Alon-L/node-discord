import { Avatar, UserAvatarFormat } from './Avatar';
import { BaseStruct, GatewayStruct } from './BaseStruct';
import { Bot } from './bot';
import { DMChannel, TextChannel } from './channels';
import { UserFlags } from './flags';
import { Snowflake } from '../types';

/**
 * User nitro types
 */
enum NitroType {
  None,
  NitroClassic,
  Nitro,
}

/**
 * Represents a user in the Discord platform

 * @extends BaseStruct
 */
export class User extends BaseStruct {
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
  public avatarHash!: string | null;

  /**
   * Whether the user is a bot
   */
  public isBot: boolean | undefined;

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

  /**
   * {@link NitroType} object containing the type of nitro subscription on a user's account
   */
  public nitroType: NitroType | undefined;

  /**
   * The flags on a user's account
   */
  public flags: UserFlags | undefined;

  /**
   * The public flags on a user's account
   */
  public publicFlags: UserFlags | undefined;

  /**
   * This user's DM channel with the bot, if cached
   */
  public dm: DMChannel | undefined;

  constructor(bot: Bot, user: GatewayStruct) {
    super(bot, user);

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
    this.avatarHash = user.avatar;
    this.isBot = user.bot;
    this.system = user.system;
    this.mfaEnabled = user.mfa_enabled;
    this.locale = user.locale;
    this.verified = user.verified;
    this.email = user.email;
    this.nitroType = user.premium_type;

    if (user.flags) {
      this.flags = new UserFlags(user.flags);
    }

    if (user.public_flags) {
      this.flags = new UserFlags(user.public_flags);
    }

    return this;
  }

  /**
   * Returns a user's avatar URL. Returns the default user avatar if the user does not have an avatar.
   * *Note: the default user avatar only supports type {@link IconFormat.PNG}*
   * @param {UserAvatarFormat} format The avatar image format
   * @param {number} size The avatar image size
   * @returns {string}
   */
  public avatarURL(format: UserAvatarFormat = UserAvatarFormat.PNG, size?: number): string {
    return Avatar.userAvatarURL(this.avatarHash, this.id, this.hashtag, format, size);
  }

  /**
   * Creates a new DM channel between this user and the bot user
   * @returns {Promise<DMChannel>}
   */
  public createDM(): Promise<DMChannel> {
    return this.bot.api.createDM(this.id);
  }

  /**
   * Sends a DM message to the user from the bot user
   * @param {any} args Identical to the arguments of {@link TextChannel.sendMessage}
   * @returns {any} Identical to the return type of {@link TextChannel.sendMessage}
   */
  public async sendMessage(
    ...args: Parameters<TextChannel['sendMessage']>
  ): ReturnType<TextChannel['sendMessage']> {
    const dm = this.dm || (await this.createDM());

    return dm.sendMessage(...args);
  }

  /**
   * Combines a user's username and hashtag and generates a full name
   * @type {string}
   * @example Day#0001
   */
  public get fullName(): string {
    return `${this.username}#${this.hashtag}`;
  }

  /**
   * @ignore
   * @returns {string}
   */
  public toString(): string {
    return `<@${this.id}>`;
  }
}
