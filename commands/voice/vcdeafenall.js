const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'vcdeafenall',
    category: 'voice',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('DEAFEN_MEMBERS')) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Deafen members\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }
        if (!message.guild.me.permissions.has('DEAFEN_MEMBERS')) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `I must have \`Deafen members\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }
        if (!message.member.voice.channel) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must be connected to a voice channel first.`
                        )
                ]
            });
        }
        let own = message.author.id == message.guild.ownerId
        if (
            !own &&
            message.member.roles.highest.position <=
                message.guild.me.roles.highest.position
        ) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            })
        }

        try {
            let i = 0;
            message.member.voice.channel.members.forEach(async (member) => {
                i++;
                await member.voice.setDeaf(true,`${message.author.tag} | ${message.author.id}`);
                await client.util.sleep(1000);
            });
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `<a:Tick:1306038825054896209>  | Successfully Deafened ${i} Members in ${message.member.voice.channel}!`
                        )
                ]
            });
        } catch (err) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `I don't have the required permissions to deafen members.`
                        )
                ]
            });
        }
    }
};
