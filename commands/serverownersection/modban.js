const { MessageEmbed } = require('discord.js');
const Moderator = require('../../models/moderator'); 

module.exports = {
    name: 'modban',
    category: 'unbypassable',
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | You need the `BAN_MEMBERS` permission to use this command.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const memberToBan = message.mentions.members.first();
        if (!memberToBan) {
            return message.channel.send('<a:stolen_emoji:1330513545112064092> | Please mention a user to ban.');
        }

        const mod = await Moderator.findOne({ userId: message.author.id });

        if (!mod) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | You must be a mod to ban members.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        if (message.member.roles.highest.position <= memberToBan.roles.highest.position) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor('RED')
                        .setDescription('<a:stolen_emoji:1330513545112064092> | You do not have permission to ban this user. You must have a higher role.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        try {
            await memberToBan.ban({ reason: `Banned by ${message.author.tag}` });

            message.channel.send({
                embeds: [
                    embed
                        .setColor('GREEN')
                        .setDescription(`<a:stolen_emoji:1330526992298414131> | Successfully banned ${memberToBan.user.tag}.`)
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
                        .setDescription('<a:stolen_emoji:1330513545112064092> | An error occurred while trying to ban the user.')
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }
    }
};
