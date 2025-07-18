const mongoose = require('mongoose');

const bypassSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  bypassUsers: { type: [String], default: [] },
});

module.exports = mongoose.model('Bypass', bypassSchema);
