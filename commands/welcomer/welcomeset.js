const { MessageEmbed } = require('discord.js');
const { getSettingsar } = require('../../models/autorole');

module.exports = {
    name: 'welcomeset',
    category: 'welcomer',
    run: async (client, message, args) => {
        if (message.guild.memberCount < 0) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Your Server Doesn't Meet My 30 Member Criteria`
                        )
                ]
            });
        }

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `You must have \`Administration\` perms to run this command.`
                        )
                ]
            });
        }

        let isown = message.author.id == message.guild.ownerId;
        if (!isown && !client.util.hasHigher(message.member)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | You must have a higher role than me to use this command.`
                        )
                ]
            });
        }

        const settings = await getSettingsar(message.guild);
        const filter = m => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });
        let currentStep = 0;
        const steps = ['description', 'title', 'color', 'thumbnail', 'channel'];
        let skipped = {};

        await promptForStep(currentStep);

        collector.on('collect', async m => {
            const content = m.content.trim().toLowerCase();
            
            if (content === 'skip') {
                skipped[steps[currentStep]] = true;
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Skipped setting the ${steps[currentStep]}.`)
                    ]
                });
            } else if (steps[currentStep] === 'description') {
                await client.util.setDescription(settings, m.content);
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Welcome message description has been set!`)
                    ]
                });
            } else if (steps[currentStep] === 'title') {
                await client.util.setTitle(settings, m.content);
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Welcome message title has been set!`)
                    ]
                });
            } else if (steps[currentStep] === 'color') {
                if (!client.util.isHex(m.content)) {
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(`You must provide a valid hex code (e.g., #FF5733). Please try again or type 'skip'.`)
                        ]
                    });
                    return;
                }
                
                settings.welcome.embed.color = m.content;
                settings.save();
                
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Welcome message color has been set to \`${m.content}\`!`)
                    ]
                });
            } else if (steps[currentStep] === 'thumbnail') {
                const status = m.content.toUpperCase();
                
                if (!['ON', 'OFF'].includes(status)) {
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(`Please provide a valid status: \`on\` or \`off\`. Please try again or type 'skip'.`)
                        ]
                    });
                    return;
                }
                
                await client.util.setThumbnail(settings, status);
                
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Welcome message thumbnail has been set to \`${status}\`!`)
                    ]
                });
            } else if (steps[currentStep] === 'channel') {
                if (content === 'none') {
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(`Welcome channel has been reset. No welcome messages will be sent.`)
                        ]
                    });
                } else {
                    const channelMention = m.mentions.channels.first();
                    const channelId = channelMention ? channelMention.id : m.content;
                    const channel = message.guild.channels.cache.get(channelId);
                    
                    if (!channel) {
                        await message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(`Could not find that channel. Please mention a valid channel or provide a channel ID. Try again or type 'skip'.`)
                            ]
                        });
                        return;
                    }
                    
                    let response = await client.util.setChannel(settings, channel);
                    
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(response)
                        ]
                    });
                }
            }

            currentStep++;
            
            if (currentStep >= steps.length) {
                collector.stop('completed');
                return;
            }
            
            await promptForStep(currentStep);
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Welcome message setup timed out. Your changes have been saved.`)
                    ]
                });
            } else if (reason === 'completed') {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`Welcome message setup completed! Your welcome message has been configured.\n\nNow use \`Welcome On\` to enable the welcome message.`)
                    ]
                });
            }
        });

        async function promptForStep(step) {
            switch (steps[step]) {
                case 'description':
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`Set Welcome Message Description`)
                                .setDescription(
                                    "Please enter the description for your welcome message or type 'skip' to skip.\n\n" +
                                    "Available variables:\n" +
                                    "`{server}` - Server Name\n" +
                                    "`{count}` - Server Members\n" +
                                    "`{member:name}` - Member's Username\n" +
                                    "`{member:mention}` - Member's Mention\n" +
                                    "`{member:id}` - Member's Id\n" +
                                    "`{member:created_at}` - Member's Account Creation Timestamp"
                                )
                        ]
                    });
                    break;
                case 'title':
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`Set Welcome Message Title`)
                                .setDescription(
                                    "Please enter the title for your welcome message or type 'skip' to skip.\n\n" +
                                    "Available variables:\n" +
                                    "`{server}` - Server Name\n" +
                                    "`{count}` - Server Members\n" +
                                    "`{member:name}` - Member's Username"
                                )
                        ]
                    });
                    break;
                case 'color':
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`Set Welcome Message Color`)
                                .setDescription(
                                    "Please enter a hex color code for your welcome message (e.g., #FF5733) or type 'skip' to skip."
                                )
                        ]
                    });
                    break;
                case 'thumbnail':
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`Set Welcome Message Thumbnail`)
                                .setDescription(
                                    "Do you want to show the user's avatar as a thumbnail?\n" +
                                    "Type 'on' to enable, 'off' to disable, or 'skip' to skip."
                                )
                        ]
                    });
                    break;
                case 'channel':
                    await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setTitle(`Set Welcome Channel`)
                                .setDescription(
                                    "Please mention a channel or provide a channel ID where welcome messages should be sent."
                                )
                        ]
                    });
                    break;
            }
        }
    }
};
