const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'support',
    aliases: ['helpserver', 'supportserver'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const supportServerLink = 'https://discord.gg/rfzop';

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTitle('Need Help? Join Our Support Server!')
            .setDescription(
                `If you need any assistance or have any questions, feel free to join our support server. Our team is always ready to assist you!`
            )
            .addField('Support Server Link', `[Click here to join the support server](${supportServerLink})`)
            .setImage('https://media.giphy.com/media/l0MYy9YxeJZ2JOUda/giphy.gif') 
            .setFooter({
                text: `If you're having trouble, our staff is always ready to assist you!`,
                iconURL: client.user.displayAvatarURL(),
            })
            .setTimestamp();

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Join Support Server')
                    .setStyle('LINK')
                    .setURL(supportServerLink),
                new MessageButton()
                    .setLabel('More Info')
                    .setStyle('PRIMARY')
                    .setCustomId('more_info') 
            );

        const sentMessage = await message.channel.send({
            embeds: [embed],
            components: [row],
        });

        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'more_info') {
                await interaction.update({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setTitle('More Info About the Support Server')
                            .setDescription('Here you can find more details about how we handle support requests.')
                            .addField('Support Hours', '24/7 support available.')
                            .addField('Available Channels', 'We have channels for general support, bot issues, and suggestions.')
                            .setFooter({
                                text: `Requested by ${message.author.tag}`,
                                iconURL: message.author.displayAvatarURL({ dynamic: true }),
                            })
                            .setTimestamp(),
                    ],
                    components: [row],
                });
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                sentMessage.edit({
                    components: [], 
                });
            }
        });
    },
};
