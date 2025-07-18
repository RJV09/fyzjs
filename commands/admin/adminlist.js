const { MessageEmbed } = require('discord.js');
const Admin = require('../../models/admin'); 

module.exports = {
    name: 'adminlist',
    category: 'unbypassable',
    permissions: ['MANAGE_GUILD'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        let own = message.author.id == message.guild.ownerId;
        const check = await client.util.isExtraOwner(message.author, message.guild);

        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only the server owner or an additional owner is authorized to run this command.`
                        ),
                ],
            });
        }

        if (
            !own &&
            !(message?.guild.members.cache.get(client.user.id).roles.highest.position <= message?.member?.roles?.highest.position)
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `${client.emoji.cross} | Only the server owner or an extra owner with a higher role than mine is authorized to run this command.`
                );
            return message.channel.send({ embeds: [higherole] });
        }

        const admins = await Admin.find();

        if (admins.length === 0) {
            return message.channel.send(
                `${client.emoji.cross} | There are no admins in the list yet.`
            );
        }

        const adminList = admins.map(
            (admin, index) => `${index + 1}. ${admin.username} (ID: ${admin.userId})`
        ).join('\n');

        const adminListEmbed = new MessageEmbed()
            .setTitle('Admin List')
            .setColor(client.color)
            .setDescription(adminList);

        message.channel.send({ embeds: [adminListEmbed] });
    },
};
