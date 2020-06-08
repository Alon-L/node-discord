import Member from './Member';
import { Snowflake, TEMP } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import Timestamp from '../Timestamp';
import Bot from '../bot/Bot';
import GuildBaseStruct from '../guild/GuildBaseStruct';

export enum PresenceActivityType {
  Game,
  Streaming,
  Listening,
  Custom,
}

export interface PresenceActivityTimestamps {
  start?: number;
  end?: number;
}

export interface PresenceActivityEmoji {
  name: string;
  id?: Snowflake;
  animated?: boolean;
}

export interface PresenceActivityParty {
  id?: string;
  size?: [number, number];
}

export interface PresenceActivityAssets {
  largeImage?: string;
  largeText?: string;
  smallImage?: string;
  smallText?: string;
}

export interface PresenceActivitySecrets {
  join?: string;
  spectate?: string;
  match?: string;
}

export interface PresenceActivity {
  name: string;
  type: PresenceActivityType;
  url?: string | null;
  createdAt: number;
  timestamps?: PresenceActivityTimestamps;
  applicationId?: Snowflake;
  details?: string | null;
  state?: string | null;
  emoji?: PresenceActivityEmoji;
  party?: PresenceActivityParty;
  assets?: PresenceActivityAssets;
  secrets?: PresenceActivitySecrets;
  instance?: boolean;
  flags?: TEMP;
}

export type PresenceStatus = 'idle' | 'dnd' | 'online' | 'offline';

export interface PresenceClientStatus {
  desktop?: string;
  mobile?: string;
  web?: string;
}

class MemberPresence extends GuildBaseStruct {
  public readonly member: Member;

  public game: PresenceActivity | undefined;

  public status!: PresenceStatus;

  public activities: PresenceActivity[] | undefined;

  public clientStatus!: PresenceClientStatus;

  public premiumSince: Timestamp | undefined;

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
      this.premiumSince = new Timestamp(presence.premium_since);
    }

    this.nick = presence.nick;

    return this;
  }

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
      flags: activity.flags,
    };
  }
}

export default MemberPresence;
