const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['botinvite', 'addbot'],
    category: 'information',
    premium: false,
    run: async (client, message, args) => {
        const clientId = '1303617045455310888'; 
        const permissions = 'PERMISSION_INTEGER'; 

        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=${permissions}`;

        const embed = new MessageEmbed()
            .setColor(client.color || 'BLUE')
            .setTitle('Invite Me to Your Server!')
            .setDescription(`Click the link below to invite me to your server!`)
            .addField('https://discord.com/oauth2/authorize?client_id=1303617045455310888&permissions=8&integration_type=0&scope=bot', `[Click Here to Invite Me!](${inviteLink})`)
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        await message.channel.send({ embeds: [embed] });
    },
};
