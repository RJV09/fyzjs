const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'purgecontains',
    aliases: ['purgekeyword', 'purge'],
    category: 'mod',
    premium: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async (client, message, args) => {

        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('You must have `Manage Messages` permission to purge messages.')
                ]
            });
        }

        const keyword = args.join(' ');
        if (!keyword) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000') 
                        .setDescription('Please provide a keyword or text to search for.')
                ]
            });
        }

        try {

            const messages = await message.channel.messages.fetch({ limit: 100 });

            const messagesToDelete = messages.filter(msg => msg.content.toLowerCase().includes(keyword.toLowerCase()));

            if (messagesToDelete.size === 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('FF0000')
                            .setDescription(`No messages found containing the keyword \`${keyword}\`.`)
                    ]
                });
            }

            await message.channel.bulkDelete(messagesToDelete, true);

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('00FF00') 
                        .setDescription(`Successfully purged ${messagesToDelete.size} messages containing the keyword \`${keyword}\`.`)
                ]
            });

        } catch (error) {
            console.error('Error purging messages:', error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000') 
                        .setDescription('An error occurred while purging messages.')
                ]
            });
        }
    }
};
