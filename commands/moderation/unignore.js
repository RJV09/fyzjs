const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unignoreuser',
    aliases: ['unignoreuser'],
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
                        .setDescription('You must have `Administrator` permissions to unignore users.')
                ]
            });
        }

        const userToUnignore = message.mentions.users.first();
        if (!userToUnignore) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('Please mention the user you want to unignore.')
                ]
            });
        }

        const ignored = await client.db.get(`ignored_${message.guild.id}_${userToUnignore.id}`);
        if (!ignored) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription(`${userToUnignore.tag} is not currently ignored.`)
                ]
            });
        }

        try {
            await client.db.delete(`ignored_${message.guild.id}_${userToUnignore.id}`);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('00FF00') 
                        .setDescription(`${userToUnignore.tag} has been successfully un-ignored and can now use the bot.`)
                ]
            });
        } catch (error) {
            console.error('Error un-ignoring user:', error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('An error occurred while un-ignoring the user.')
                ]
            });
        }
    }
};
