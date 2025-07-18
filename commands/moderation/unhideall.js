const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unhideall',
    aliases: ['uhall'],
    category: 'mod',
    premium: true,

    run: async (client, message, args) => {
        console.log("Command 'unhideall' triggered."); 
        
        if (!message.member.permissions.has('MANAGE_CHANNELS') || message.member.roles.highest.comparePositionTo(message.guild.me.roles.highest) <= 0) {
            const error = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `You must have \`Manage Channels\` permission to use this command.`
                );
            return message.channel.send({ embeds: [error] });
        }

        message.guild.channels.cache.forEach(channel => {
            if (channel.type === 'GUILD_TEXT' || channel.type === 'GUILD_VOICE' || channel.type === 'GUILD_CATEGORY') {
                if (channel.manageable) {
                    channel.permissionOverwrites.edit(message.guild.id, {
                        VIEW_CHANNEL: null,
                        reason: `${message.author.tag} (${message.author.id})`
                    });
                }
            }
        });

        const emb = new MessageEmbed()
            .setDescription(`<:IconTick:1245261305561223199> | All channels are now visible to @everyone role`)
            .setColor(client.color);
        return message.channel.send({ embeds: [emb] });
    }
};
