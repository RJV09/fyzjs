const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'addblockword',
    category: 'automod',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR') && message.guild.ownerId !== message.member.id) {
            return message.channel.send('You must be the server owner or have administrator permissions to use this command.');
        }

        const word = args.join(' ').toLowerCase();
        if (!word) {
            return message.channel.send('Please provide a word to block.');
        }

        const blockedWordsPath = path.join(__dirname, '../../blockedWords.json');

        if (!fs.existsSync(blockedWordsPath)) {
            const initialData = {};
            try {
                fs.writeFileSync(blockedWordsPath, JSON.stringify(initialData, null, 2));
            } catch (err) {
                return message.channel.send('An error occurred while creating the blocked words file.');
            }
        }

        let blockedWordsData;
        try {
            blockedWordsData = JSON.parse(fs.readFileSync(blockedWordsPath, 'utf8'));
        } catch (err) {
            return message.channel.send('An error occurred while reading the blocked words file.');
        }

        if (!blockedWordsData[message.guild.id]) {
            blockedWordsData[message.guild.id] = [];
        }

        if (blockedWordsData[message.guild.id].includes(word)) {
            return message.channel.send('This word is already blocked.');
        }

        blockedWordsData[message.guild.id].push(word);

        try {
            fs.writeFileSync(blockedWordsPath, JSON.stringify(blockedWordsData, null, 2));
        } catch (err) {
            return message.channel.send('An error occurred while saving the blocked words file.');
        }

        message.channel.send(`The word \`${word}\` has been successfully added to the blocked words list.`);
    },
};
