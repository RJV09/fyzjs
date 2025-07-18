const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Giveaway = require('../../models/giveaway.js'); // Adjust the path as needed

module.exports = {
    name: 'greroll',
    category: 'give',
    description: 'Selects a new winner for the giveaway.',
    aliases: [],
    premium: false,
    async run(client, message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#E6B800')
                        .setDescription(
                            `${client.emoji.cross} | You must have \`Administration\` perms to run this command.`
                        )
                ]
            });
        }

        // Find the giveaway in the database by message ID
        const messageId = args[0]; // Assuming args[0] is the message ID of the giveaway to reroll
        if (!messageId) {
            return message.reply('Please provide the message ID of the giveaway to reroll winners.');
        }

        try {
            // Find the giveaway in the database based on message ID
            const giveaway = await Giveaway.findOne({ messageId: messageId });
            if (!giveaway) {
                return message.reply('Giveaway not found.');
            }

            const currentTime = new Date();
            if (currentTime < giveaway.endsAt) {
                return message.reply('The giveaway has not ended yet.');
            }

            const channel = await client.channels.cache.get(giveaway.channelId);
            if (!channel) {
                return message.reply('Channel not found.');
            }

            // Fetch the giveaway message
            const giveawayMessage = await channel.messages.fetch(giveaway.messageId);
            if (!giveawayMessage) {
                return message.reply('Giveaway message not found.');
            }

            // Reroll winners for the giveaway
            await endGiveaway(client, giveaway, giveawayMessage);

        } catch (error) {
            console.error('Error rerolling giveaway:', error);
            message.reply('An error occurred while rerolling the giveaway.');
        }
    }
};

async function endGiveaway(client, giveaway, activeTimeouts) {
    const channel = await client.channels.cache.get(giveaway.channelId);
    if (!channel) return;

    try {
        const message = await channel.messages.fetch(giveaway.messageId);
        if (!message) return;

        const reactions = message.reactions.cache.get(giveaway.emoji);
        if (!reactions) return;

        const users = await reactions.users.fetch();
        const filtered = users.filter(user => !user.bot);

        let winners = []; // Initialize winners array here

        if (filtered.size > 0) {
            for (let i = 0; i < giveaway.numWinners; i++) {
                const winner = filtered.random();
                winners.push(winner);
                filtered.delete(winner.id); // Ensure unique winners
            }

            const congratulationsMessage = `Congrats, ${winners.map(user => user.toString()).join(', ')} You won **${giveaway.prize}**, hosted by <@${giveaway.hostId}>`;

            const giveawayLinkButton = new MessageButton()
                .setLabel('View Giveaway')
                .setStyle('LINK')
                .setURL(`https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`);

            // Creating an action row and adding the button to it
            const actionRow = new MessageActionRow()
                .addComponents(giveawayLinkButton);

            // Sending congratulations message with the action row
            await channel.send({ content: congratulationsMessage, components: [actionRow] });
        } else {
            await channel.send('No entries detected therefore cannot declare the winner.');
        }

        const endEmbed = new MessageEmbed(message.embeds[0])
            .setTitle(`<:gift_box:1345721164659425330> **${giveaway.prize}** <:gift_box:1345721164659425330>`)
            .setDescription(`<:adot:1345720454865879051> Ended: <t:${Math.floor(Date.now() / 1000)}:R>\n<:adot:1345720454865879051> Hosted by: <@${giveaway.hostId}>\n\n<:adot:1345720454865879051> **Winners:**\n${winners.length > 0 ? winners.map(user => user.toString()).join(', ') : 'No entries detected therefore cannot declare the winner.'}`)
            .setFooter('Ended');
        await message.edit({ content: '<:Levix_supreme:1345722732230217748> **Giveaway Ended** <:Levix_supreme:1345722732230217748>', embeds: [endEmbed] });

        if (activeTimeouts[giveaway.messageId]) {
            clearTimeout(activeTimeouts[giveaway.messageId]);
            delete activeTimeouts[giveaway.messageId];
        }
    } catch (error) {
        console.error('Error ending giveaway:', error);
    }
}
