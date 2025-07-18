const { MessageEmbed, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');

module.exports = {
    name: 'antiverify',
    aliases: [],
    cooldown: 5,
    category: 'automod',
    subcommand: ['enable', 'disable'],
    premium: false,
    run: async (client, message, args) => {
        const embed = new MessageEmbed().setColor(client.color);

        if (message.author.id !== message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<a:crs:1304817967413854209> | Only the **server owner** can use this command.`
                    ),
                ],
            });
        }

        if (!message.guild.me.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<a:crs:1304817967413854209> | I don't have \`Administrator\` permissions to execute this command.`
                    ),
                ],
            });
        }

        const option = args[0];
        const isActivatedAlready = (await client.db.get(`antiverify_${message.guild.id}`)) ?? null;

        switch (option) {
            case 'enable':
                if (isActivatedAlready) {
                    return message.channel.send({
                        embeds: [
                            embed.setDescription(
                                '<:red:1290545303409393727> | Antiverify is already enabled in this server.'
                            ),
                        ],
                    });
                }

                await client.db.set(`antiverify_${message.guild.id}`, true);

                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                        VIEW_CHANNEL: false,
                    });
                });

                let verifyChannel = message.guild.channels.cache.find(
                    (ch) => ch.name.toLowerCase() === 'FyZen verify'
                );

                if (!verifyChannel) {
                    verifyChannel = await message.guild.channels.create('FyZen Verify', {
                        type: 'GUILD_TEXT',
                        permissionOverwrites: [
                            {
                                id: message.guild.roles.everyone.id,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                            },
                        ],
                    });
                }

                let verifyRole = message.guild.roles.cache.find(
                    (role) => role.name === 'FyZen Verified Users'
                );
                if (!verifyRole) {
                    verifyRole = await message.guild.roles.create({
                        name: 'FyZen Verify Users',
                        color: 'BLUE',
                        permissions: [],
                    });
                }

                const verifyEmbed = new MessageEmbed()
                    .setColor('#000000') 
                    .setTitle('FyZen Verification System')
                    .setDescription('Click the button below to verify yourself.');

                const verifyButton = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('verify_button')
                        .setLabel('Verify Me')
                        .setStyle('SECONDARY') 
                );

                await verifyChannel.send({
                    embeds: [verifyEmbed],
                    components: [verifyButton],
                });

                const collector = verifyChannel.createMessageComponentCollector({
                    componentType: 'BUTTON',
                    time: 0, 
                });

                collector.on('collect', async (interaction) => {
                    if (interaction.customId === 'verify_button') {
                        const modal = new Modal()
                            .setCustomId('verification_modal')
                            .setTitle('Verification Question')
                            .addComponents(
                                new MessageActionRow().addComponents(
                                    new TextInputComponent()
                                        .setCustomId('answer_input')
                                        .setLabel('What is 2 + 2?')
                                        .setStyle('SHORT') 
                                        .setRequired(true)
                                )
                            );

                        await interaction.showModal(modal);

                        const modalFilter = (i) =>
                            i.customId === 'verification_modal' &&
                            i.user.id === interaction.user.id;

                        interaction
                            .awaitModalSubmit({ filter: modalFilter, time: 30000 }) 
                            .then(async (modalInteraction) => {
                                const answer = modalInteraction.fields.getTextInputValue('answer_input');

                                if (answer.trim() === '4') {
                                    await interaction.member.roles.add(verifyRole);

                                    message.guild.channels.cache.forEach(async (channel) => {
                                        await channel.permissionOverwrites.edit(interaction.member, {
                                            VIEW_CHANNEL: true,
                                        });
                                    });

                                    await modalInteraction.reply({
                                        content: '✅ You have been verified and can now access all channels!',
                                        ephemeral: true,
                                    });
                                } else {
                                    await modalInteraction.reply({
                                        content: '❌ Incorrect answer. Please try again.',
                                        ephemeral: true,
                                    });
                                }
                            })
                            .catch(() => {
                                interaction.followUp({
                                    content: '⏳ You did not complete the verification in time. Please try again.',
                                    ephemeral: true,
                                });
                            });
                    }
                });

                await message.channel.send({
                    embeds: [
                        embed
                            .setTitle('Antiverify Enabled')
                            .setDescription(
                                '**<:greentick:1290545729688965232> | Antiverify has been successfully enabled. All channels are hidden, and the "FyZen Verify" channel has been created with a verification system.**'
                            )
                            .addField(
                                'Next Steps',
                                'Direct your members to the "FyZen Verify" channel to verify themselves.'
                            )
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                });
                break;

            case 'disable':
                if (!isActivatedAlready) {
                    return message.channel.send({
                        embeds: [
                            embed.setDescription(
                                '<:redwrong:1290545864191774753> | Antiverify is not enabled in this server.'
                            ),
                        ],
                    });
                }

                await client.db.set(`antiverify_${message.guild.id}`, false);

                message.guild.channels.cache.forEach(async (channel) => {
                    await channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                        VIEW_CHANNEL: true,
                    });
                });

                await message.channel.send({
                    embeds: [
                        embed
                            .setTitle('Antiverify Disabled')
                            .setDescription(
                                '**<:redwrong:1290545864191774753> | Antiverify has been disabled. All channels are now visible to everyone.**'
                            )
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                });
                break;

            default:
                return message.channel.send({
                    embeds: [
                        embed
                            .setTitle('Antiverify Command')
                            .setDescription(
                                'Enable or disable antiverify mode. This will hide all channels and create a "Jingle Verify" channel for user verification.'
                            )
                            .addField('Usage', '`antiverify enable` | `antiverify disable`')
                            .setTimestamp()
                            .setFooter(client.user.username, client.user.displayAvatarURL())
                    ],
                });
        }
    },
};
