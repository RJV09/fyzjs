const {
    Message,
    Client,
    MessageEmbed
} = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'autoresponder',
    aliases: ['ar'],
    category: 'reactor',
    description: 'Create, update, or remove autoresponses to trigger words',
    usage: '&autoresponder create/update/remove/list <trigger> <response>',
    run: async (client, message, args) => {

        const embed = new MessageEmbed().setColor(client.color);
        let prefix = message.guild.prefix;

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setTitle('Autoresponder Command')
                        .setDescription(
                            `Please provide the required arguments.\n\n` +
                            `${prefix}autoresponder \`create\` \`<trigger word>\` \`<reply>\`\n` +
                            `${prefix}autoresponder \`update\` \`<trigger word>\` \`<edited reply>\`\n` +
                            `${prefix}autoresponder \`remove\` \`<trigger word>\`\n` +
                            `${prefix}autoresponder \`list\``
                        )
                ]
            });
        }

        const subCommand = args[0].toLowerCase();

        if (subCommand === 'list') {
            const autoResponders = await client.db.get(`autoresponders_${message.guild.id}`) || {};
            const triggerList = Object.keys(autoResponders);
            
            if (triggerList.length === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setTitle('Autoresponders List')
                            .setDescription('No autoresponders have been set up in this server.')
                    ]
                });
            }
            
            const infoArray = [];
            
            for (let i = 0; i < triggerList.length; i++) {
                const trigger = triggerList[i];
                const response = autoResponders[trigger];
                infoArray.push(`**${i + 1}.** Trigger: \`${trigger}\`\nResponse: ${response.length > 100 ? response.substring(0, 100) + '...' : response}`);
            }
            
            return await client.util.pagination(
                message,
                infoArray,
                '**Autoresponders List**'
            );
        }

        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide a trigger word.\n` +
                            `${prefix}autoresponder \`${subCommand}\` \`<trigger word>\` ${subCommand !== 'remove' ? '`<response>`' : ''}`
                        )
                ]
            });
        }

        const trigger = args[1].toLowerCase();

        let autoResponders = await client.db.get(`autoresponders_${message.guild.id}`) || {};

        switch (subCommand) {
            case 'create':
            case 'add':

                if (!args[2]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `Please provide a response for the trigger word.\n` +
                                    `${prefix}autoresponder \`create\` \`${trigger}\` \`<response>\``
                                )
                        ]
                    });
                }

                if (autoResponders[trigger]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | A response for \`${trigger}\` already exists! Use \`${prefix}autoresponder update\` to modify it.`
                                )
                        ]
                    });
                }

                const response = args.slice(2).join(' ');
                autoResponders[trigger] = response;
                await client.db.set(`autoresponders_${message.guild.id}`, autoResponders);

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully added autoresponder!\n` +
                                `**Trigger:** \`${trigger}\`\n` +
                                `**Response:** ${response}`
                            )
                    ]
                });

            case 'update':
            case 'edit':
                if (!args[2]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `Please provide an updated response for the trigger word.\n` +
                                    `${prefix}autoresponder \`update\` \`${trigger}\` \`<edited response>\``
                                )
                        ]
                    });
                }

                if (!autoResponders[trigger]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | No autoresponder found for \`${trigger}\`! Use \`${prefix}autoresponder create\` to make one.`
                                )
                        ]
                    });
                }

                const updatedResponse = args.slice(2).join(' ');
                autoResponders[trigger] = updatedResponse;
                await client.db.set(`autoresponders_${message.guild.id}`, autoResponders);

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully updated autoresponder!\n` +
                                `**Trigger:** \`${trigger}\`\n` +
                                `**New Response:** ${updatedResponse}`
                            )
                    ]
                });

            case 'remove':
            case 'delete':
                if (!autoResponders[trigger]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | No autoresponder found for \`${trigger}\`!`
                                )
                        ]
                    });
                }

                const removedResponse = autoResponders[trigger];

                delete autoResponders[trigger];
                await client.db.set(`autoresponders_${message.guild.id}`, autoResponders);

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully removed autoresponder!\n` +
                                `**Trigger:** \`${trigger}\`\n` +
                                `**Response was:** ${removedResponse}`
                            )
                    ]
                });

            default:
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `Unknown subcommand. Available options are: \`create\`, \`update\`, \`remove\`, \`list\`.\n\n` +
                                `${prefix}autoresponder \`create\` \`<trigger word>\` \`<reply>\`\n` +
                                `${prefix}autoresponder \`update\` \`<trigger word>\` \`<edited reply>\`\n` +
                                `${prefix}autoresponder \`remove\` \`<trigger word>\`\n` +
                                `${prefix}autoresponder \`list\``
                            )
                    ]
                });
        }
    }
};
