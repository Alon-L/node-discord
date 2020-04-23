import fetch from 'node-fetch';
import WebSocket from 'ws';
import BotHeartbeats from './BotHeartbeats';
import properties, { version, identify } from './properties';

export enum OPCodes {
  Dispatch,
  Heartbeat,
  Identify,
  PresenceUpdate,
  VoiceStateUpdate,
  Resume = 6,
  Reconnect,
  RequestGuildMembers,
  InvalidSession,
  Hello,
  HeartbeatACK,
}

export enum GatewayEvents {
  Ready = 'READY',
  Resumed = 'RESUMED',
  Reconnect = 'RECONNECT',
  InvalidSession = 'INVALID_SESSION',
  ChannelCreate = 'CHANNEL_CREATE',
  ChannelUpdate = 'CHANNEL_UPDATE',
  ChannelDelete = 'CHANNEL_DELETE',
  ChannelPinsUpdate = 'CHANNEL_PINS_UPDATE',
  GuildCreate = 'GUILD_CREATE',
  GuildUpdate = 'GUILD_UPDATE',
  GuildDelete = 'GUILD_DELETE',
  GuildBanAdd = 'GUILD_BAN_ADD',
  GuildBanRemove = 'GUILD_BAN_REMOVE',
  GuildEmojisUpdate = 'GUILD_EMOJIS_UPDATE',
  GuildIntegrationsUpdate = 'GUILD_INTEGRATIONS_UPDATE',
  GuildMemberAdd = 'GUILD_MEMBER_ADD',
  GuildMemberRemove = 'GUILD_MEMBER_REMOVE',
  GuildMemberUpdate = 'GUILD_MEMBER_UPDATE',
  GuildMembersChunk = 'GUILD_MEMBERS_CHUNK',
  GuildRoleCreate = 'GUILD_ROLE_CREATE',
  GuildRoleUpdate = 'GUILD_ROLE_UPDATE',
  GuildRoleDelete = 'GUILD_ROLE_DELETE',
  InviteCreate = 'INVITE_CREATE',
  InviteDelete = 'INVITE_DELETE',
  MessageCreate = 'MESSAGE_CREATE',
  MessageUpdate = 'MESSAGE_UPDATE',
  MessageDelete = 'MESSAGE_DELETE',
  MessageDeleteBulk = 'MESSAGE_DELETE_BULK',
  MessageReactionAdd = 'MESSAGE_REACTION_ADD',
  MessageReactionRemove = 'MESSAGE_REACTION_REMOVE',
  MessageReactionRemoveAll = 'MESSAGE_REACTION_REMOVE_ALL',
  MessageReactionRemoveEmoji = 'MESSAGE_REACTION_REMOVE_EMOJI',
  PresenceUpdate = 'PRESENCE_UPDATE',
  TypingStart = 'TYPING_START',
  UserUpdate = 'USER_UPDATE',
  VoiceStateUpdate = 'VOICE_STATE_UPDATE',
  VoiceServerUpdate = 'VOICE_SERVER_UPDATE',
  WebhooksUpdate = 'WEBHOOKS_UPDATE',
}

export interface Payload {
  op: OPCodes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  d: any;
  s: number;
  t: GatewayEvents;
}

class BotSocket {
  private readonly token: string;
  private sessionId: string;
  private heartbeats: BotHeartbeats;
  public ws: WebSocket;
  public sequence: number;

  constructor(token: string) {
    this.token = token;

    this.sequence = null;
  }

  public async connect(): Promise<void> {
    const url = await this.socketURL();

    this.ws = new WebSocket(url);
    this.ws.on('message', this.message.bind(this));

    this.heartbeats = new BotHeartbeats(this);
  }

  private async message(data: string): Promise<void> {
    const payload = BotSocket.parse(data);

    const { op, d, s } = payload;

    switch (op) {
      case OPCodes.Dispatch:
        this.sequence = s;
        this.handleDispatch(payload);
        break;
      case OPCodes.Hello:
        this.heartbeats.interval = d.heartbeat_interval;
        this.heartbeats.start();

        this.identify();
        break;
      case OPCodes.HeartbeatACK:
        // TODO: Heartbeat ACK
        break;
    }
  }

  private identify(): void {
    this.ws.send(
      BotSocket.pack({
        op: OPCodes.Identify,
        d: {
          ...identify,
          token: this.token,
        },
      }),
    );
  }

  private handleDispatch(payload: Payload): void {
    // Set session ID in case of a Ready event
    if (payload.t === GatewayEvents.Ready) {
      this.sessionId = payload.d.session_id;
    }

    console.log(payload.t);
  }

  private static parse(data: string): Payload {
    return JSON.parse(data);
  }

  public static pack(data: any): ReturnType<typeof JSON.stringify> {
    return JSON.stringify(data);
  }

  private async socketURL(): Promise<string> {
    return `${await this.url}/?v=${version}&encoding=json`;
  }

  private get url(): Promise<string> {
    return fetch(`${properties.baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    })
      .then((res) => res.json())
      .then(({ url }) => url);
  }
}

export default BotSocket;
