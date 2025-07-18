const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'oldmember',
    aliases: ['old', 'checkold'],
    cooldown: 5,
    category: 'utility',
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (!member) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription("<:emoji_1725906884992:1306038885293494293> | Please mention a valid member or use the command without arguments to check yourself.")
                        .setTimestamp()
                        .setFooter(client.user.username, client.user.displayAvatarURL())
                ]
            });
        }

        const joinDate = member.joinedAt;
        const currentDate = new Date();

        const diffTime = Math.abs(currentDate - joinDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

        const threshold = 183;

        let oldMemberStatus = diffDays >= threshold ? 'Old Member' : 'New Member';

        return message.channel.send({
            embeds: [
                embed
                    .setTitle(`${member.user.tag} is an ${oldMemberStatus}`)
                    .setDescription(
                        `**Join Date**: ${joinDate.toDateString()}\n` +
                        `**Days Since Joined**: ${diffDays} days\n` +
                        `This user is considered an **${oldMemberStatus}**.\n\n` +
                        `Threshold for being an old member is ${threshold} days.`
                    )
                    .setTimestamp()
                    .setFooter(client.user.username, client.user.displayAvatarURL())
            ]
        });
    }
};
