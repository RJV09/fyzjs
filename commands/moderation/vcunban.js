const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'vcunban',
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
                            `<a:anxCross2:1321773462699642991> | You must mention a user or provide their ID to vcunban.`
                        ),
                ],
            });
        }

        const isVcbanned = await client.db.get(`vcban_${message.guild.id}_${member.id}`);

        if (!isVcbanned) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | <@${member.user.id}> is not VC-banned.`
                        ),
                ],
            });
        }

        try {
            await client.db.delete(`vcban_${message.guild.id}_${member.id}`);

            if (member.voice.channel) {
                await member.voice.setMute(false, 'VC Unban');
            }

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully vc-unbanned <@${member.user.id}>. They can now speak in any voice channel.`
                        ),
                ],
            });

            try {
                await member.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('GREEN')
                            .setDescription(
                                `You have been **VC Unbanned** and can now speak in voice channels in **${message.guild.name}**.`
                            ),
                    ],
                });
            } catch (err) {
                console.error(`Could not DM user: ${err.message}`);
            }
        } catch (err) {
            console.error(err);
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('BLACK')
                        .setDescription(
                            `<a:anxCross2:1321773462699642991> | An error occurred while trying to vc-unban <@${member.user.id}>.`
                        ),
                ],
            });
        }
    },
};
