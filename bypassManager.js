const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://SpaceMusic:shivamop@cluster0.kgvij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dbName = "quickadmin";

let dbClient;
async function connectDB() {
    if (!dbClient) {
        dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await dbClient.connect();
    }
    return dbClient.db(dbName);
}

async function getBypassList(guildId) {
    const db = await connectDB();
    const collection = db.collection('bypassList');
    const result = await collection.findOne({ guild_id: guildId });
    return result ? result.bypassList : [];
}

async function addUserToBypass(guildId, userId) {
    const db = await connectDB();
    const collection = db.collection('bypassList');

    const result = await collection.updateOne(
        { guild_id: guildId },
        {
            $addToSet: { bypassList: userId },
        },
        { upsert: true } 
    );
    return result;
}

async function removeUserFromBypass(guildId, userId) {
    const db = await connectDB();
    const collection = db.collection('bypassList');

    const result = await collection.updateOne(
        { guild_id: guildId },
        {
            $pull: { bypassList: userId }, 
        }
    );
    return result;
}

module.exports = {
    getBypassList,
    addUserToBypass,
    removeUserFromBypass
};
