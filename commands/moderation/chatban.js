const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'chatban',
    category: 'mod',
    run: async (client, message, args) => {

        if (!message.member.permissions.has('MANAGE_CHANNELS') && message.guild.ownerId !== message.member.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must be the **Guild Owner** or have \`Manage Channels\` permission to use this command.`
                        ),
                ],
            });
        }

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]);

        if (!member) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to chatban.`
                        ),
                ],
            });
        }

        try {
            
            const channelId = message.channel.id;
            await client.db.set(`chatban_${message.guild.id}_${member.id}`, channelId);

            
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully chatbanned <@${member.user.id}>.`
                        ),
                ],
            });

            
            try {
                await member.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setDescription(
                                `You are currently chatbanned and cannot send messages in <#${channelId}> in **${message.guild.name}**.`
                            ),
                    ],
                });
            } catch (err) {
                console.error(`Could not DM user: ${err.message}`);
            }
        } catch (err) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | An error occurred while trying to chatban <@${member.user.id}>.`
                        ),
                ],
            });
        }
    },
};
