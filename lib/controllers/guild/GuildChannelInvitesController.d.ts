import Collection from '../../Collection';
import { Invite, InviteOptions } from '../../structures';
import { GuildChannel } from '../../structures/channels';
import { BaseCreateController, BaseFetchAllController } from '../base';
/**
 * Provides an interface for a guild channel's invites cache.
 * The invites are mapped by their invite codes
 */
export declare class GuildChannelInvitesController extends BaseFetchAllController<Invite> implements BaseCreateController<Invite, InviteOptions> {
    /**
     * The channel this controller is associated to
     */
    readonly channel: GuildChannel;
    constructor(channel: GuildChannel);
    /**
     * Fetches all invites for this channel.
     * Requires the {@link Permission.ManageChannels} permission
     * @returns {Promise<Collection<string, Invite>>}
     */
    fetchAll(): Promise<Collection<string, Invite>>;
    /**
     * Creates a new invite for a guild channel.
     * Requires the {@link Permission.CreateInstantInvite} permission
     * @param {InviteOptions} options The new invite options
     * @returns {Promise<Invite>}
     */
    create(options?: InviteOptions): Promise<Invite>;
}
