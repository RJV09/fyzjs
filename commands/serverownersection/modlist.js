const { MessageEmbed } = require('discord.js');
const Moderator = require('../../models/moderator');

module.exports = {
    name: 'modlist',
    category: 'unbypassable',
    permissions: ['MANAGE_GUILD'],
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        const mods = await Moderator.find();
        if (mods.length === 0) {
            return message.channel.send('No mods in the server.');
        }

        const modList = mods.map(mod => `<@${mod.userId}>`).join('\n');
        
        message.channel.send({
            embeds: [
                embed
                    .setTitle('Mod List')
                    .setDescription(modList)
                    .setTimestamp()
                    .setFooter(client.user.username, client.user.displayAvatarURL())
            ]
        });
    }
};
