const mongoose = require("mongoose");

const guildPrefixSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    prefix: { type: String, default: "!" } // Default prefix
});

module.exports = mongoose.model("GuildPrefix", guildPrefixSchema);
