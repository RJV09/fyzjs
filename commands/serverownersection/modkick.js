const { MessageEmbed } = require('discord.js');
const Moderator = require('../../models/moderator'); 

module.exports = {
    name: 'modkick',
    category: 'unbypassable',
    permissions: ['KICK_MEMBERS'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | You need the `KICK_MEMBERS` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const memberToKick = message.mentions.members.first();
        if (!memberToKick) {
            return message.channel.send('<a:stolen_emoji:1330513545112064092> | Please mention a user to kick.');
        }
        const mod = await Moderator.findOne({ userId: message.author.id });

        if (!mod) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | You must be a mod to kick members.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
        if (message.member.roles.highest.position <= memberToKick.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | You do not have permission to kick this user. You must have a higher role.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        try {
            await memberToKick.kick({ reason: `Kicked by ${message.author.tag}` });

            message.channel.send({
                embeds: [
                    embed
                        .setColor('GREEN')
                        .setDescription(`<a:stolen_emoji:1330526992298414131> | Successfully kicked ${memberToKick.user.tag}.`)
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        } catch (error) {
            console.error(error);
            message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | An error occurred while trying to kick the user.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
