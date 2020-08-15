import { Params } from '../../socket/rateLimit';
import { Snowflake } from '../../types';
import { InviteOptions } from '../Invite';
import { Role } from '../Role';
import { CreateGuildChannelOptions, GuildChannelOptions } from '../channels';
import {
  FetchGuildOptions,
  GuildChannelPositions,
  FetchInviteOptions,
  FetchReactionUsersOptions,
  FetchSomeMembersOptions,
  FetchSomeMessagesOptions,
} from '../controllers';
import { Permissible, PermissionOverwriteFlags } from '../flags';
import { ModifyGuildOptions, EmojiOptions } from '../guild';
import { ModifyMemberOptions } from '../member';
import { MessageData, MessageEmbed } from '../message';

/**
 * Serializes API options and data into the API format
 */
export class APISerializer {
  /**
   * Serializes an array of role IDs and role instances into an array of role IDs
   * @param {(Role | Snowflake)[]} roles The roles array
   * @returns {Snowflake[]}
   */
  private static roleIds(roles: (Role | Snowflake)[]): Snowflake[] {
    return roles.map((role: Role | Snowflake) => (role instanceof Role ? role.id : role));
  }

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
   * Returns the serialized fetch some messages options for when fetching some messages in a text channel
   * @param {FetchSomeMessagesOptions} options The fetch some messages options
   * @returns {Params}
   */
  public static fetchSomeMessagesOptions(options?: FetchSomeMessagesOptions): Params {
    return (
      options && {
        around: options.around,
        before: options.before,
        after: options.after,
        limit: options.limit,
      }
    );
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
   * Returns the serialized create guild channel options for creating new guild channels
   * @param {CreateGuildChannelOptions} options The create guild channel options
   * @returns {Params}
   */
  public static createGuildChannelOptions(options: CreateGuildChannelOptions): Params {
    return {
      name: options.name,
      type: options.type,
      topic: options.topic,
      bitrate: options.bitrate,
      user_limit: options.userLimit,
      rate_limit_per_user: options.slowModeTimeout,
      position: options.position,
      permission_overwrites:
        options.permissions &&
        Object.entries(options.permissions).map(([id, overwrite]) => ({
          id,
          type: overwrite.type,
          allow: overwrite.allow?.bits,
          deny: overwrite.deny?.bits,
        })),
      parent_id: options.parentId,
      nsfw: options.nsfw,
    };
  }

  /**
   * Returns the serialized guild channel positions for when modifying guild channel positions
   * @param {GuildChannelPositions} positions The guild channel positions
   * @returns {Params}
   */
  public static guildChannelPositions(positions: GuildChannelPositions): Params {
    return Object.entries(positions).map(([id, position]) => ({ id, position }));
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
      roles: options.roles && APISerializer.roleIds(options.roles),
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
   * Returns the serialized fetch all members options for when fetching all members in a guild
   * @param {ModifyGuildOptions} options The fetch all members options
   * @returns {Params}
   */
  public static fetchSomeMembersOptions(options?: FetchSomeMembersOptions): Params {
    return (
      options && {
        limit: options.limit,
        after: options.after,
      }
    );
  }

  /**
   * Returns the serialized modify member options for when modifying guild members
   * @param {ModifyMemberOptions} options The modify member options
   * @returns {Params}
   */
  public static modifyMemberOptions(options: ModifyMemberOptions): Params {
    return {
      nick: options.nick,
      // Serialize the role IDs
      roles: options.roles && APISerializer.roleIds(options.roles),
      mute: options.mute,
      deaf: options.deaf,
      channel_id: options.channelId,
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