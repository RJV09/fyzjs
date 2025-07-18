const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['createembed'],
    category: 'mod',
    premium: false,
    usage: '[title] [description] [color] [footer]',
    run: async (client, message, args) => {
        if (args.length < 2) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription('You must provide a **title** and **description** for the embed!')
                ]
            });
        }

        const title = args[0];
        const description = args.slice(1).join(' ');

        let color = '#3498db'; 
        let footerText = null;

        const colorMatch = description.match(/#[0-9A-F]{6}/i); 
        if (colorMatch) {
            color = colorMatch[0];
            description.replace(colorMatch[0], '').trim(); 
        }

        const footerMatch = description.match(/\[footer:(.*?)\]/);
        if (footerMatch) {
            footerText = footerMatch[1];
            description = description.replace(footerMatch[0], '').trim(); 
        }

        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter(footerText || `Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        return message.channel.send({ embeds: [embed] });
    }
};
