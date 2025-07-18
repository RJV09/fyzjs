const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'removeblockword',
    category: 'automod',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR') && message.guild.ownerId !== message.member.id) {
            return message.channel.send('You must be the server owner or have administrator permissions to use this command.');
        }

        const word = args.join(' ').toLowerCase();
        if (!word) {
            return message.channel.send('Please provide a word to unblock.');
        }

        const blockedWordsPath = path.join(__dirname, '../../blockedWords.json');
        let blockedWordsData = JSON.parse(fs.readFileSync(blockedWordsPath, 'utf8'));

        if (!blockedWordsData[message.guild.id] || !blockedWordsData[message.guild.id].includes(word)) {
            return message.channel.send('This word is not in the blocked words list.');
        }

        blockedWordsData[message.guild.id] = blockedWordsData[message.guild.id].filter(w => w !== word);

        fs.writeFileSync(blockedWordsPath, JSON.stringify(blockedWordsData, null, 2));

        message.channel.send(`The word \`${word}\` has been successfully removed from the blocked words list.`);
    },
};
