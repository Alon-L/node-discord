import Collection from '../../Collection';
import { Invite, InviteOptions } from '../../structures';
import { GuildChannel } from '../../structures/channels';
import { BaseCreateController, BaseFetchAllController } from '../base';

/**
 * Provides an interface for a guild channel's invites cache.
 * The invites are mapped by their invite codes
 */
export class GuildChannelInvitesController extends BaseFetchAllController<Invite>
  implements BaseCreateController<Invite, InviteOptions> {
  /**
   * The channel this controller is associated to
   */
  public readonly channel: GuildChannel;

  constructor(channel: GuildChannel) {
    super(channel);

    this.channel = channel;
  }

  /**
   * Fetches all invites for this channel.
   * Requires the {@link Permission.ManageChannels} permission
   * @returns {Promise<Collection<string, Invite>>}
   */
  public async fetchAll(): Promise<Collection<string, Invite>> {
    const invites = await this.bot.api.fetchChannelInvites(this.channel.id);

    this.cache.merge(invites);

    return invites;
  }

  /**
   * Creates a new invite for a guild channel.
   * Requires the {@link Permission.CreateInstantInvite} permission
   * @param {InviteOptions} options The new invite options
   * @returns {Promise<Invite>}
   */
  public create(options?: InviteOptions): Promise<Invite> {
    return this.bot.api.createChannelInvite(this.channel.id, options);
  }
}
