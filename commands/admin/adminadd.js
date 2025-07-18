const { MessageEmbed } = require('discord.js');
const Admin = require('../../models/admin'); 

module.exports = {
    name: 'adminadd',
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
        if (!member) return message.channel.send('Please mention a user to add to the admin list.');

        const existingAdmin = await Admin.findOne({ userId: member.id });
        if (existingAdmin) {
            return message.channel.send('This user is already an admin.');
        }

        const newAdmin = new Admin({
            userId: member.id,
            username: member.user.tag,
        });
        await newAdmin.save();

        message.channel.send(`${member.user.tag} has been added to the admin list.`);
    }
};
