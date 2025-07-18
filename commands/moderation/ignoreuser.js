const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ignoreuser',
    aliases: ['ignoreuser'],
    category: 'mod',
    premium: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('You must have `Administrator` permissions to ignore users.')
                ]
            });
        }


        const userToIgnore = message.mentions.users.first();
        if (!userToIgnore) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('Please mention the user you want to ignore.')
                ]
            });
        }


        try {
            await client.db.set(`ignored_${message.guild.id}_${userToIgnore.id}`, true);

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('00FF00') 
                        .setDescription(`${userToIgnore.tag} has been successfully ignored and cannot use the bot now.`)
                ]
            });

        } catch (error) {
            console.error('Error ignoring user:', error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('An error occurred while ignoring the user.')
                ]
            });
        }
    }
};
