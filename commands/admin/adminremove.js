const { MessageEmbed } = require('discord.js');
const Admin = require('../../models/admin'); 

module.exports = {
    name: 'adminremove',
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

        const member = message.mentions.members.first();
        if (!member) return message.channel.send('Please mention a user to remove from the admin list.');

        const admin = await Admin.findOne({ userId: member.id });
        if (!admin) {
            return message.channel.send('This user is not in the admin list.');
        }

        await Admin.deleteOne({ userId: member.id });

        message.channel.send(`${member.user.tag} has been removed from the admin list.`);
    }
};
