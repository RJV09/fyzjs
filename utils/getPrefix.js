const GuildPrefix = require("../models/guildPrefix");

async function getPrefix(guildId) {
    const guildConfig = await GuildPrefix.findOne({ guildId });
    return guildConfig ? guildConfig.prefix : "!";
}

module.exports = getPrefix;
