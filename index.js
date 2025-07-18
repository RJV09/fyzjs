const wait = require('wait');
require('dotenv').config();
require('module-alias/register');
const path = require('path');
const FyZen = require(`./structures/FyZen.js`);
const client = new FyZen();
this.config = require(`./config.json`);
const fs = require('fs');
const vcbanHandler = require('./events/vcbanHandler');

client.on('voiceStateUpdate', (oldState, newState) => vcbanHandler(client, oldState, newState));

client.on('messageCreate', (message) => {
    if (message.content.startsWith('!addblockword')) {
        addBlockWordCommand.run(client, message, message.content.slice(15).trim().split(/\s+/));
    }
});

client.on('messageCreate', async (message) => {
    const MentionEveryoneHandler = require('./events/MentionEveryone.js');
    await MentionEveryoneHandler(client, message);
});

require('./events/voiceStateUpdate.js')(client);
require('./events/blockwords')(client);
require('./events/quickadmin')(client);

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    
    const autoResponders = await client.db.get(`autoresponders_${message.guild.id}`) || {};
    const autoReactors = await client.db.get(`autoreactors_${message.guild.id}`) || {};
    const messageLower = message.content.toLowerCase();
    const messageWords = messageLower.split(/\s+/);

    for (const trigger in autoResponders) {
        if (messageWords.includes(trigger.toLowerCase())) {
            message.channel.send(autoResponders[trigger]);
            break; 
        }
    }

    for (const trigger in autoReactors) {
        if (messageWords.includes(trigger.toLowerCase())) {
            try {
                await message.react(autoReactors[trigger]);
            } catch (error) {
                console.error(`Failed to react with emoji ${autoReactors[trigger]} for trigger '${trigger}':`, error);
            }
        }
    }
});

// ✅ Reaction Role System ✅
client.reactionRoles = new Map();

client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot || !client.reactionRoles) return;
    
    const roleData = client.reactionRoles.get(reaction.message.id);
    if (!roleData || reaction.emoji.name !== roleData.emoji) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (member) await member.roles.add(roleData.roleId);
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (user.bot || !client.reactionRoles) return;
    
    const roleData = client.reactionRoles.get(reaction.message.id);
    if (!roleData || reaction.emoji.name !== roleData.emoji) return;

    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id);
    if (member) await member.roles.remove(roleData.roleId);
});

async function updateExpiredEntries() {
    let entries = (await client.db.get(`noprefix_${client.user.id}`)) || [];
    let now = Date.now();

    entries = entries.filter(entry => {
        let isValid = entry.expiration === 'Unlimited' || entry.expiration > now;
        let willExpireSoon = entry.expiration !== 'Unlimited' && entry.expiration - now < 3600000; 

        return isValid;
    });

    await client.db.set(`noprefix_${client.user.id}`, entries);
}

const activeTimeouts = {};

async function loadActiveGiveaways(client, activeTimeouts) {
    const giveaways = await Giveaway.find({ endsAt: { $gt: new Date() } });

    giveaways.forEach(giveaway => {
        const remainingTime = new Date(giveaway.endsAt) - new Date();
        if (remainingTime > 0) {
            const timeout = setTimeout(async () => {
                await endGiveaway(client, giveaway, activeTimeouts);
            }, remainingTime);

            activeTimeouts[giveaway.messageId] = timeout;
        } else {
            endGiveaway(client, giveaway, activeTimeouts);
        }
    });
}

async function endGiveaway(client, giveaway, activeTimeouts) {
    const channel = await client.channels.cache.get(giveaway.channelId);
    if (!channel) return;

    try {
        if (giveaway.isEnded) return;

        const message = await channel.messages.fetch(giveaway.messageId);
        if (!message) return;

        const reactions = message.reactions.cache.get(giveaway.emoji);
        if (!reactions) return;

        const users = await reactions.users.fetch();
        const filtered = users.filter(user => !user.bot);    

        let winners = [];

        if (filtered.size > 0) {
            for (let i = 0; i < giveaway.numWinners; i++) {
                const winner = filtered.random();
                winners.push(winner);
                filtered.delete(winner.id);
            }

            const congratulationsMessage = `Congrats, ${winners.map(user => user.toString()).join(', ')} You won **${giveaway.prize}**, hosted by <@${giveaway.hostId}>`;

            const giveawayLinkButton = new MessageButton()
                .setLabel('View Giveaway')
                .setStyle('LINK')
                .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`);

            const actionRow = new MessageActionRow()
                .addComponents(giveawayLinkButton);

            await channel.send({ content: congratulationsMessage, components: [actionRow] });
        } else {
            await channel.send('No entries detected therefore cannot declare the winner.');
        }

        if (activeTimeouts[giveaway.messageId]) {
            clearTimeout(activeTimeouts[giveaway.messageId]);
            delete activeTimeouts[giveaway.messageId];
        }
    } catch (error) {
        console.error('Error ending giveaway:', error);
    }
}

client.db = {};
async function initializeMongoose() {
    await client.initializeMongoose();
}

async function initializeData() {
    await client.initializedata();
}

async function waitThreeSeconds() {
    await wait(3000);
}

async function loadEvents() {
    await client.loadEvents();
}

async function loadLogs() {
    await client.loadlogs();
}

async function loadMain() {
    await client.loadMain();
}

async function loginBot() {
    const settings = require('./config.json');
    await client.login(settings.TOKEN);
}

async function main() {
    try {
        await initializeMongoose();
        await initializeData();
        await waitThreeSeconds();
        await loadEvents();
        await loadLogs();
        await loadMain();
        await loginBot();
        await updateExpiredEntries();
    } catch (error) {
        console.error('Error:', error);
    }
}

main();

module.exports.endGiveaway = endGiveaway;
module.exports.activeTimeouts = activeTimeouts;
