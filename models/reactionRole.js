const mongoose = require('mongoose');

const reactionRoleSchema = new mongoose.Schema({
    messageId: String,
    emoji: String,
    roleId: String,
    guildId: String,
    channelId: String
});

module.exports = mongoose.model('ReactionRole', reactionRoleSchema);
