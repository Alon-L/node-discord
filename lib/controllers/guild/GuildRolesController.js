"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildRolesController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's roles cache.
 * The roles are mapped by their IDs
 */
class GuildRolesController extends base_1.BaseFetchAllController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Fetches all roles in this guild
     * @returns {Promise<Collection<Snowflake, Role>>}
     */
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const roles = yield this.bot.api.fetchRoles(this.guild.id);
            this.cache.merge(roles);
            return roles;
        });
    }
    /**
     * Creates a new role in this guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {RoleOptions | undefined} options The options for the created role
     * @returns {Promise<Role>}
     */
    create(options) {
        return this.bot.api.createRole(this.guild.id, options);
    }
    /**
     * Modifies the positions of a set of roles for this guild.
     * Requires the {@link Permission.ManageRoles}
     * @param {Positions} positions The new roles positions
     * @returns {Promise<Collection<Snowflake, Role>>} A collection of all the guild's roles
     */
    modifyPositions(positions) {
        return this.bot.api.modifyRolesPositions(this.guild.id, positions);
    }
    /**
     * Deletes a role in this guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} id The ID of the role
     * @returns {Promise<void>}
     */
    delete(id) {
        return this.bot.api.deleteRole(this.guild.id, id);
    }
}
exports.GuildRolesController = GuildRolesController;
