const mongoose = require('mongoose');

const afkSchema = new mongoose.Schema({
    Guild: { type: String, required: true },
    Member: { type: String, required: true },
    Reason: { type: String, default: 'No reason provided' },
    Time: { type: Date, default: Date.now }
});


const Afk = mongoose.model('Afk', afkSchema);

module.exports = Afk;
