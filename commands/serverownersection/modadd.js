const { MessageEmbed } = require('discord.js');
const Moderator = require('../../models/moderator');

module.exports = {
    name: 'modadd',
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
                            `${client.emoji.cross} | **Only the server owner or an additional owner is authorized to run this command**.`
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
                    `${client.emoji.cross} | **Only the server owner or an extra owner with a higher role than mine is authorized to run this command**.`
                );
            return message.channel.send({ embeds: [higherole] });
        }
        const member = message.mentions.members.first();
        if (!member) return message.channel.send('<a:stolen_emoji:1330513545112064092> | Please mention a user to add to the mod list.');
        const existingMod = await Moderator.findOne({ userId: member.id });
        if (existingMod) {
            return message.channel.send('<a:stolen_emoji:1330513545112064092> | This user is already a mod.');
        }
        const newMod = new Moderator({
            userId: member.id,
            username: member.user.tag,
        });
        await newMod.save();

        message.channel.send(`${member.user.tag} has been added to the mod list.`);
    },
};
