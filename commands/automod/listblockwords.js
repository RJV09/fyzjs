const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'listblockwords',
    category: 'automod',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR') && message.guild.ownerId !== message.member.id) {
            return message.channel.send('You must be the server owner or have administrator permissions to use this command.');
        }
        const blockedWordsPath = path.join(__dirname, '../../blockedWords.json');
        let blockedWordsData = JSON.parse(fs.readFileSync(blockedWordsPath, 'utf8'));

        const blockedWords = blockedWordsData[message.guild.id] || [];

        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Blocked Words List')
            .setDescription(blockedWords.length ? blockedWords.join(', ') : 'No blocked words set.');

        message.channel.send({ embeds: [embed] });
    },
};
