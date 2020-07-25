import BaseCreateController from './base/BaseCreateController';
import BaseFetchAllController from './base/BaseFetchAllController';
import Cluster from '../../Cluster';
import Invite, { InviteOptions } from '../Invite';
import GuildChannel from '../channels/GuildChannel';

/**
 * Provides an interface for a guild channel's invites cache.
 * The invites are mapped by their invite codes
 */
class GuildChannelInvitesController extends BaseFetchAllController<Invite>
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
   * @returns {Promise<Cluster<string, Invite>>}
   */
  public async fetchAll(): Promise<Cluster<string, Invite>> {
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

export default GuildChannelInvitesController;
