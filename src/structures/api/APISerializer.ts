import { Params } from '../../socket/rateLimit/Requests';
import { Snowflake } from '../../types/types';
import { InviteOptions } from '../Invite';
import Role from '../Role';
import { GuildChannelOptions } from '../channels/GuildChannel';
import { FetchGuildOptions } from '../controllers/BotGuildsController';
import { FetchInviteOptions } from '../controllers/GuildInvitesController';
import { FetchReactionUsersOptions } from '../controllers/ReactionUsersController';
import { Permissible, PermissionOverwriteFlags } from '../flags/PermissionFlags';
import { ModifyGuildOptions } from '../guild/Guild';
import { EmojiOptions } from '../guild/GuildEmoji';
import { MessageData } from '../message/Message';
import MessageEmbed from '../message/MessageEmbed';

/**
 * Serializes API options and data into the API format
 */
class APISerializer {
  /**
   * Returns the serialized guild channel options for when modifying a guild channel
   * @param {GuildChannelOptions} options The guild channel options
   * @returns {Params}
   */
  public static guildChannelOptions(options: GuildChannelOptions): Params {
    return {
      name: options.name,
      type: options.type,
      topic: options.topic,
      nsfw: options.nsfw,
      rate_limit_per_user: options.slowModeTimeout,
      bitrate: options.bitrate,
      user_limit: options.userLimit,
    };
  }

  /**
   * Returns the serialized message data for when sending or editing messages
   * @param {MessageData} data The message data
   * @returns {Params}
   */
  public static messageData(data: MessageData): Params {
    const { embed } = data;

    return {
      ...data,
      embed:
        embed &&
        (embed instanceof MessageEmbed ? embed.structure : MessageEmbed.dataToStructure(embed)),
    };
  }

  /**
   * Returns the serialized fetch reactions options for when fetching all users that reacted with a reaction
   * @param {FetchReactionUsersOptions} options The fetch reaction users options
   * @returns {Params}
   */
  public static fetchReactionUsersOptions(options?: FetchReactionUsersOptions): Params {
    return options && (options as Params);
  }

  /**
   * Returns the serialized guild channel permissions for when modifying a guild channel's permissions
   * @param {Permissible} permissible Data for the member or role
   * @param {PermissionOverwriteFlags} flags The modified permissions
   * @returns {Params}
   */
  public static guildChannelPermissions(
    permissible: Permissible,
    flags: PermissionOverwriteFlags,
  ): Params {
    return {
      type: permissible.type,
      allow: flags.allow?.bits,
      deny: flags.deny?.bits,
    };
  }

  /**
   * Returns the serialized invite options for when creating a guild channel invite
   * @param {InviteOptions} options The invite options
   * @returns {Params}
   */
  public static inviteOptions(options?: InviteOptions): Params {
    return (
      options && {
        max_age: options.max?.age,
        max_uses: options.max?.uses,
        temporary: options.temporary,
        unique: options.unique,
      }
    );
  }

  /**
   * Returns the serialized emoji options for when creating or modifying emojis
   * @param {EmojiOptions} options The emoji options
   * @returns {Params}
   */
  public static emojiOptions(options: EmojiOptions): Params {
    return {
      ...options,
      // Serialize the role IDs
      roles: options.roles?.map((role: Role | Snowflake) =>
        role instanceof Role ? role.id : role,
      ),
    };
  }

  /**
   * Returns the serialized fetch guild options for when fetching a guild
   * @param {FetchGuildOptions} options The fetch guild options
   * @returns {Params}
   */
  public static fetchGuildOptions(options?: FetchGuildOptions): Params {
    return (
      options && {
        with_counts: options.withCounts,
      }
    );
  }

  /**
   * Returns the serialized modify guild options for when modifying a guild
   * @param {ModifyGuildOptions} options The modify guild options
   * @returns {Params}
   */
  public static modifyGuildOptions(options: ModifyGuildOptions): Params {
    return {
      name: options.name,
      region: options.region,
      verification_level: options.levels?.verification,
      default_message_notifications: options.levels?.notifications,
      explicit_content_filter: options.levels?.explicitContent,
      afk_channel_id: options.afk?.channel?.id,
      afk_timeout: options.afk?.timeout,
      icon: options.icon,
      owner_id: options.ownerId,
      splash: options.splash,
      banner: options.banner,
      system_channel_id: options.systemChannelId,
      rules_channel_id: options.rulesChannelId,
      public_updates_channel_id: options.updatesChannelId,
      preferred_locale: options.locale,
    };
  }

  /**
   * Returns the serialized fetch invite options for when fetching an invite
   * @param {FetchInviteOptions} options The fetch invite options
   * @returns {Params}
   */
  public static fetchInviteOptions(options?: FetchInviteOptions): Params {
    return (
      options && {
        with_counts: options.withCounts,
      }
    );
  }
}

export default APISerializer;
