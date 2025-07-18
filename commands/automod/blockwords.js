const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'blockword',
    category: 'automod',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR') && message.guild.ownerId !== message.member.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription('You must be the **Guild Owner** or have `Administrator` permission to use this command.')
                ],
            });
        }

        const guideEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Blockword System Guide')
            .setDescription('This guide will help you set up and manage blocked words in your server.')
            .addFields(
                {
                    name: '1. Add Blocked Word',
                    value: 'Use the command `!addblockword <word>` to add a word to the blocked words list.',
                    inline: false,
                },
                {
                    name: '2. Remove Blocked Word',
                    value: 'Use the command `!removeblockword <word>` to remove a word from the blocked words list.',
                    inline: false,
                },
                {
                    name: '3. List Blocked Words',
                    value: 'Use the command `!listblockwords` to view the current list of blocked words.',
                    inline: false,
                },
                {
                    name: '4. Message Deletion',
                    value: 'If a member sends a message containing a blocked word, the bot will automatically delete the message and notify the member via DM.',
                    inline: false,
                },
                {
                    name: 'Important Notes',
                    value: 'The server **Owner** or **Administrator** permissions are required to manage the blocked words. Use these commands responsibly.',
                    inline: false,
                }
            )
            .setFooter('Developed By Team Fire')
            .setTimestamp();

        message.channel.send({
            embeds: [guideEmbed],
        });
    },
};
