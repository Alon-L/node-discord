import Member from './Member';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import Bot from '../bot/Bot';
import PresenceActivityFlags from '../flags/PresenceActivityFlags';
import GuildBaseStruct from '../guild/GuildBaseStruct';

/**
 * The type of the presence activity
 */
export enum PresenceActivityType {
  Game,
  Streaming,
  Listening,
  Custom,
}

/**
 * The timestamps of the presence activity
 */
export interface PresenceActivityTimestamps {
  /**
   * Unix time in (milliseconds) of when the activity started
   */
  start?: number;

  /**
   * Unix time (in milliseconds) of when the activity ends
   */
  end?: number;
}

/**
 * The information about the presence emoji for a custom status
 */
export interface PresenceActivityEmoji {
  /**
   * The name of the emoji
   */
  name: string;

  /**
   * The ID of the emoji
   */
  id?: Snowflake;

  /**
   * Whether this emoji is animated
   */
  animated?: boolean;
}

/**
 * Information for party showed in a member's presence activity
 */
export interface PresenceActivityParty {
  /**
   * The ID of the party
   */
  id?: string;

  /**
   * Used to show the party's current and maximum size
   * ```typescript
   * [current_size, max_size]
   * ```
   */
  size?: [number, number];
}

/**
 * Information for the presence's images and their hover texts
 */
export interface PresenceActivityAssets {
  /**
   * The ID for a large asset of the activity, usually a snowflake
   */
  largeImage?: string;

  /**
   * Text displayed when hovering over the large image of the activity
   */
  largeText?: string;

  /**
   * The ID for a small asset of the activity, usually a snowflake
   */
  smallImage?: string;

  /**
   * Text displayed when hovering over the small image of the activity
   */
  smallText?: string;
}

/**
 * Presence secrets for Rich Presence joining and spectating
 */
export interface PresenceActivitySecrets {
  /**
   * The secret for joining a party
   */
  join?: string;

  /**
   * The secret for spectating a game
   */
  spectate?: string;

  /**
   * The secret for a specific instanced match
   */
  match?: string;
}

/**
 * Object presenting the member's current activity
 */
export interface PresenceActivity {
  /**
   * The activity's name
   */
  name: string;

  /**
   * The activity's type
   */
  type: PresenceActivityType;

  /**
   * Stream URL, is validated when type is {@link PresenceActivityType.Streaming}
   */
  url?: string | null;

  /**
   * Unix timestamp of when the activity was added to the member's session
   */
  createdAt: number;

  /**
   * Unix timestamps for start and/or end of the game
   */
  timestamps?: PresenceActivityTimestamps;

  /**
   * Application ID for the game
   */
  applicationId?: Snowflake;

  /**
   * What the player is currently doing
   */
  details?: string | null;

  /**
   * The member's current party status
   */
  state?: string | null;

  /**
   * The emoji used for a custom status
   */
  emoji?: PresenceActivityEmoji;

  /**
   * Information for the current party of the player
   */
  party?: PresenceActivityParty;

  /**
   * Images for the presence and their hover texts
   */
  assets?: PresenceActivityAssets;

  /**
   * Secrets for Rich Presence joining and spectating
   */
  secrets?: PresenceActivitySecrets;

  /**
   * Whether or not the activity an instanced game session
   */
  instance?: boolean;

  /**
   * Describes what the payload includes
   */
  flags?: PresenceActivityFlags;
}

/**
 * The presence status of a member
 */
export type PresenceStatus = 'idle' | 'dnd' | 'online' | 'offline';

/**
 * Active sessions are indicated with an "online", "idle", or "dnd" string per platform. If a user is offline or invisible, the corresponding field is not present.
 */
export interface PresenceClientStatus {
  desktop?: PresenceStatus;
  mobile?: PresenceStatus;
  web?: PresenceStatus;
}

/**
 * A member's presence is their current state on a guild
 */
class MemberPresence extends GuildBaseStruct {
  /**
   * The member associated to this presence
   */
  public readonly member: Member;

  /**
   * The member's current activity
   */
  public game: PresenceActivity | undefined;

  /**
   * The member's current status
   */
  public status!: PresenceStatus;

  /**
   * The member's current activities
   */
  public activities: PresenceActivity[] | undefined;

  /**
   * The member's platform-dependent status
   */
  public clientStatus!: PresenceClientStatus;

  /**
   * When the member started boosting the guild
   */
  public boostingSince: Timestamp | undefined;

  /**
   * The member's guild nickname (if one is set)
   */
  public nick: string | undefined | null;

  constructor(bot: Bot, presence: GatewayStruct, member: Member) {
    super(bot, member.guild);

    this.member = member;

    this.init(presence);
  }

  /**
   * @ignore
   * @param {GatewayStruct} presence The presence data
   * @returns {this}
   */
  public init(presence: GatewayStruct): this {
    if (presence.game) {
      this.game = MemberPresence.createActivity(presence.game);
    }

    this.status = presence.status;

    if (presence.activities) {
      this.activities = presence.activities.map((activity: GatewayStruct) =>
        MemberPresence.createActivity(activity),
      );
    }

    this.clientStatus = presence.client_status;

    if (presence.premium_since) {
      this.boostingSince = new Timestamp(presence.premium_since);
    }

    this.nick = presence.nick;

    return this;
  }

  /**
   * Builds a {@link PresenceActivity} object from a received gateway activity object
   * @param {GatewayStruct} activity The gateway activity object
   * @returns {PresenceActivity}
   */
  private static createActivity(activity: GatewayStruct): PresenceActivity {
    return {
      name: activity.name,
      type: activity.type,
      url: activity.url,
      createdAt: activity.created_at,
      timestamps: activity.timestamps,
      applicationId: activity.applicationId,
      details: activity.details,
      state: activity.state,
      emoji: activity.emoji,
      party: activity.party,
      assets: activity.assets && {
        largeImage: activity.assets.large_image,
        largeText: activity.assets.large_text,
        smallImage: activity.assets.small_image,
        smallText: activity.assets.small_text,
      },
      secrets: activity.secrets,
      instance: activity.instance,
      flags: activity.flags && new PresenceActivityFlags(activity.flags),
    };
  }
}

export default MemberPresence;
