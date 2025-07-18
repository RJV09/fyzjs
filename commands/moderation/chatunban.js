const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'chatunban',
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
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to chatunban.`
                        ),
                ],
            });
        }

        
        const channelId = await client.db.get(`chatban_${message.guild.id}_${member.id}`);
        if (!channelId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(`<a:anxCross2:1321773462699642991> | This user is not chatbanned.`),
                ],
            });
        }

        try {
            
            await client.db.delete(`chatban_${message.guild.id}_${member.id}`);

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully chatunbanned <@${member.user.id}>.`
                        ),
                ],
            });

        } catch (err) {
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | An error occurred while trying to chatunban <@${member.user.id}>.`
                        ),
                ],
            });
        }
    },
};
