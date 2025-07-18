const {
    Message,
    Client,
    MessageEmbed
} = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'autoreactor',
    aliases: ['ar-emoji', 'are'],
    category: 'utility',
    description: 'Create, update, or remove automatic emoji reactions to trigger words',
    usage: '&autoreactor create/update/remove/list <trigger> <emoji>',
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES') && !this.config.admin.includes(message.author.id)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`${client.emoji.cross} | You don't have permission to use this command!`)
                ]
            });
        }

        const embed = new MessageEmbed().setColor(client.color);
        let prefix = message.guild.prefix;

        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setTitle('Autoreactor Command')
                        .setDescription(
                            `Please provide the required arguments.\n\n` +
                            `${prefix}autoreactor \`create\` \`<trigger word>\` \`<emoji>\`\n` +
                            `${prefix}autoreactor \`update\` \`<trigger word>\` \`<edited emoji>\`\n` +
                            `${prefix}autoreactor \`remove\` \`<trigger word>\`\n` +
                            `${prefix}autoreactor \`list\``
                        )
                ]
            });
        }

        const subCommand = args[0].toLowerCase();

        if (subCommand === 'list') {
            const autoReactors = await client.db.get(`autoreactors_${message.guild.id}`) || {};
            const triggerList = Object.keys(autoReactors);
            
            if (triggerList.length === 0) {
                return message.channel.send({
                    embeds: [
                        embed
                            .setTitle('Autoreactors List')
                            .setDescription('No autoreactors have been set up in this server.')
                    ]
                });
            }
            
            const infoArray = [];
            
            for (let i = 0; i < triggerList.length; i++) {
                const trigger = triggerList[i];
                const emoji = autoReactors[trigger];
                infoArray.push(`**${i + 1}.** Trigger: \`${trigger}\`\nEmoji: ${emoji}`);
            }
            
            return await client.util.pagination(
                message,
                infoArray,
                '**Autoreactors List**'
            );
        }

        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide a trigger word.\n` +
                            `${prefix}autoreactor \`${subCommand}\` \`<trigger word>\` ${subCommand !== 'remove' ? '`<emoji>`' : ''}`
                        )
                ]
            });
        }

        const trigger = args[1].toLowerCase();

        let autoReactors = await client.db.get(`autoreactors_${message.guild.id}`) || {};

        switch (subCommand) {
            case 'create':
            case 'add':
                if (!args[2]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `Please provide an emoji for the trigger word.\n` +
                                    `${prefix}autoreactor \`create\` \`${trigger}\` \`<emoji>\``
                                )
                        ]
                    });
                }

                if (autoReactors[trigger]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | A reaction for \`${trigger}\` already exists! Use \`${prefix}autoreactor update\` to modify it.`
                                )
                        ]
                    });
                }

                const emoji = args[2];
                let isValid = false;

                try {
                    if (emoji.startsWith('<') && emoji.endsWith('>')) {
                        const emojiId = emoji.split(':')[2].replace('>', '');
                        const testEmoji = client.emojis.cache.get(emojiId);
                        isValid = !!testEmoji;
                    } else {
                        await message.react(emoji);
                        isValid = true;
                        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(client.user.id));
                        for (const reaction of userReactions.values()) {
                            await reaction.users.remove(client.user.id);
                        }
                    }
                } catch (error) {
                    isValid = false;
                }

                if (!isValid) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(`${client.emoji.cross} | Invalid emoji provided. Please try again with a valid emoji.`)
                        ]
                    });
                }

                autoReactors[trigger] = emoji;
                await client.db.set(`autoreactors_${message.guild.id}`, autoReactors);

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully added autoreactor!\n` +
                                `**Trigger:** \`${trigger}\`\n` +
                                `**Emoji:** ${emoji}`
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
                                    `Please provide an updated emoji for the trigger word.\n` +
                                    `${prefix}autoreactor \`update\` \`${trigger}\` \`<edited emoji>\``
                                )
                        ]
                    });
                }

                if (!autoReactors[trigger]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | No autoreactor found for \`${trigger}\`! Use \`${prefix}autoreactor create\` to make one.`
                                )
                        ]
                    });
                }

                const newEmoji = args[2];
                let isValidNew = false;

                try {
                    if (newEmoji.startsWith('<') && newEmoji.endsWith('>')) {
                        const emojiId = newEmoji.split(':')[2].replace('>', '');
                        const testEmoji = client.emojis.cache.get(emojiId);
                        isValidNew = !!testEmoji;
                    } else {
                        await message.react(newEmoji);
                        isValidNew = true;
                        const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(client.user.id));
                        for (const reaction of userReactions.values()) {
                            await reaction.users.remove(client.user.id);
                        }
                    }
                } catch (error) {
                    isValidNew = false;
                }

                if (!isValidNew) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(`${client.emoji.cross} | Invalid emoji provided. Please try again with a valid emoji.`)
                        ]
                    });
                }
                const oldEmoji = autoReactors[trigger];
                
                autoReactors[trigger] = newEmoji;
                await client.db.set(`autoreactors_${message.guild.id}`, autoReactors);

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully updated autoreactor!\n` +
                                `**Trigger:** \`${trigger}\`\n` +
                                `**Old Emoji:** ${oldEmoji}\n` +
                                `**New Emoji:** ${newEmoji}`
                            )
                    ]
                });

            case 'remove':
            case 'delete':
                if (!autoReactors[trigger]) {
                    return message.channel.send({
                        embeds: [
                            embed
                                .setColor(client.color)
                                .setDescription(
                                    `${client.emoji.cross} | No autoreactor found for \`${trigger}\`!`
                                )
                        ]
                    });
                }

                const removedEmoji = autoReactors[trigger];
                
                delete autoReactors[trigger];
                await client.db.set(`autoreactors_${message.guild.id}`, autoReactors);

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `${client.emoji.tick} | Successfully removed autoreactor!\n` +
                                `**Trigger:** \`${trigger}\`\n` +
                                `**Emoji was:** ${removedEmoji}`
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
                                `${prefix}autoreactor \`create\` \`<trigger word>\` \`<emoji>\`\n` +
                                `${prefix}autoreactor \`update\` \`<trigger word>\` \`<edited emoji>\`\n` +
                                `${prefix}autoreactor \`remove\` \`<trigger word>\`\n` +
                                `${prefix}autoreactor \`list\``
                            )
                    ]
                });
        }
    }
};
