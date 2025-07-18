const { MessageEmbed } = require('discord.js');

const botOwnerId = ['760143551920078861', '1243888482355511328'];  

module.exports = {
    name: 'devban',
    aliases: [],
    category: 'owner',
    run: async (client, message, args) => {
        if (message.author.id !== botOwnerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Only the bot owner can use this command.`)
                ]
            });
        }

        let userId = args[0];

        if (!userId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | Please provide a valid user ID or mention a member.`)
                ]
            });
        }

        let user = await message.guild.members.fetch(userId).catch((error) => null);
        if (!user) {
            try {
                user = await client.users.fetch(userId);
            } catch (error) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`${client.emoji.cross} | Please provide a valid user ID or mention a member.`)
                    ]
                });
            }
        }

        if (user.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You cannot ban yourself.`)
                ]
            });
        }

        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You cannot ban the bot.`)
                ]
            });
        }

        try {
            await message.guild.members.ban(user.id, {
                reason: 'User has been globally banned due to repeated and severe violations of Discord.'
            });

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.tick} | Successfully banned <@${user.id}> from the server.`)
                ]
            });
        } catch (error) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | I don't have permission to ban this user.`)
                ]
            });
        }
    }
};