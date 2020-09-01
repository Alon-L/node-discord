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
const Member_1 = require("../../structures/member/Member");
const message_1 = require("../../structures/message");
const constants_1 = require("../constants");
const utils_1 = require("../utils");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { user_id: userId } = d;
    const handlersUtils = new utils_1.ReactionHandlersUtils(bot, d);
    const { emoji } = handlersUtils;
    const message = yield handlersUtils.getMessage();
    const { guild } = message;
    const { id } = emoji;
    // Set the reaction object for this Emoji if one hasn't been set before
    const reaction = message.reactions.cache.getOrSet(id, new message_1.MessageReaction(message, {
        emoji,
        botReacted: userId === ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id),
    }));
    // Change the reaction's botReacted state
    reaction.botReacted = userId === ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.id);
    // Increment the count of the reaction
    reaction.count++;
    const user = yield bot.users.get(userId);
    const member = d.member && guild ? new Member_1.Member(bot, d.member, guild) : undefined;
    // Add the user to the Collection of users who reacted with this reaction
    if (user) {
        reaction.users.cache.add(user);
    }
    // Add the member to the Collection of members who reacted with this reaction
    if (member) {
        reaction.members.set(member.id, member);
    }
    bot.events.emit(constants_1.BotEvent.MessageReactionAdd, reaction, member || user);
});
