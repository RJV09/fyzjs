const { Message, Client, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'createchannel',
    aliases: ['cc'],
    category: 'svowner',
    premium: false,

    /**
     * 
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        // Check if the user is the server owner
        if (message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | You must be the server owner to use this command.`
                        )
                ]
            });
        }

        // Check if the bot has the MANAGE_CHANNELS permission
        if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | I need the \`Manage Channels\` permission to create channels.`
                        )
                ]
            });
        }

        // Check if a channel name is provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<:emoji_1725906884992:1306038885293494293>  | Please provide a name for the new channel.`
                        )
                ]
            });
        }

        // Ask the user which type of channel they want to create
        const channelName = args[0];
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('text')
                .setLabel('Text Channel')
                .setStyle('PRIMARY'),
            new MessageButton()
                .setCustomId('voice')
                .setLabel('Voice Channel')
                .setStyle('SUCCESS')
        );

        const questionEmbed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(
                `What type of channel do you want to create?\n\n` +
                `**Channel Name:** ${channelName}\n` +
                `Click one of the buttons below to choose.`
            );

        const questionMessage = await message.channel.send({
            embeds: [questionEmbed],
            components: [row]
        });

        // Create a message collector to wait for the user's response
        const filter = (interaction) => interaction.user.id === message.author.id;
        const collector = questionMessage.createMessageComponentCollector({
            filter,
            time: 30000, // 30 seconds
            max: 1 // Only allow one interaction
        });

        collector.on('collect', async (interaction) => {
            // Delete the question embed message
            await questionMessage.delete().catch(() => {});

            const channelType = interaction.customId; // 'text' or 'voice'

            try {
                let newChannel;
                if (channelType === 'text') {
                    newChannel = await message.guild.channels.create(channelName, {
                        type: 'GUILD_TEXT',
                        reason: `Channel created by ${message.author.tag}`,
                    });
                } else {
                    newChannel = await message.guild.channels.create(channelName, {
                        type: 'GUILD_VOICE',
                        reason: `Channel created by ${message.author.tag}`,
                    });
                }

                // Send the success message and delete it after 5 seconds
                const successMessage = await interaction.reply({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `<a:Tick:1306038825054896209> | Successfully created the ${channelType} channel: **${newChannel.name}**.`
                            )
                    ],
                    fetchReply: true // Get the message object
                });

                // Delete the success message after 5 seconds
                setTimeout(() => {
                    successMessage.delete().catch(() => {});
                }, 5000); // 5000 milliseconds = 5 seconds
            } catch (err) {
                console.error(err);
                await interaction.reply({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | Something went wrong while creating the channel. Please try again later.`
                            )
                    ]
                });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                // Delete the question embed message if the user doesn't respond
                questionMessage.delete().catch(() => {});
                message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `<:emoji_1725906884992:1306038885293494293>  | You didn't respond in time. Please try again.`
                            )
                    ]
                });
            }
        });
    }
};