const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions,
    Collection,
    WebhookClient
} = require('discord.js');

module.exports = async (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot || !message.guild) return;
        
        try {
            // Improved error handling for blacklist check
            let check;
            try {
                check = await client.util.BlacklistCheck(message?.guild);
            } catch (error) {
                console.error('Blacklist check failed:', error);
                return;
            }
            if (check) return;

            // Premium checks with error handling
            let uprem, upremend, sprem, spremend;
            try {
                uprem = await client.db.get(`uprem_${message.author.id}`);
                upremend = await client.db.get(`upremend_${message.author.id}`);
                sprem = await client.db.get(`sprem_${message.guild.id}`);
                spremend = await client.db.get(`spremend_${message.guild.id}`);
            } catch (dbError) {
                console.error('Database error during premium check:', dbError);
                return;
            }

            // Premium expiration handling
            let scot = 0;
            let slink = 'https://discord.gg/lunardevs';
            
            if (upremend && Date.now() >= upremend) {
                try {
                    let upremcount = await client.db.get(`upremcount_${message.author.id}`) || 0;
                    let upremserver = await client.db.get(`upremserver_${message.author.id}`) || [];
                    let spremown = await client.db.get(`spremown_${message.guild.id}`);

                    await client.db.delete(`upremcount_${message.author.id}`);
                    await client.db.delete(`uprem_${message.author.id}`);
                    await client.db.delete(`upremend_${message.author.id}`);
                    
                    if (upremserver.length > 0) {
                        for (let i = 0; i < upremserver.length; i++) {
                            scot += 1;
                            await client.db.delete(`sprem_${upremserver[i]}`);
                            await client.db.delete(`spremend_${upremserver[i]}`);
                            await client.db.delete(`spremown_${upremserver[i]}`);
                        }
                    }
                    
                    await client.db.delete(`upremserver_${message.author.id}`);
                    
                    try {
                        await message.author.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `Your Premium Has Expired.\nTotal **\`${scot}\`** Server Premiums were removed.\nClick [here](${slink}) To Buy Premium.`
                                    )
                            ],
                            components: [premrow]
                        }).catch(() => {});
                    } catch (sendError) {
                        console.error('Failed to send premium expiration DM:', sendError);
                    }
                } catch (premiumError) {
                    console.error('Error handling user premium expiration:', premiumError);
                }
            }

            if (spremend && Date.now() >= spremend) {
                try {
                    let scount = 0;
                    let us = await client.db.get(`spremown_${message.guild.id}`);
                    let upremserver = await client.db.get(`upremserver_${us}`) || [];
                    let upremcount = await client.db.get(`upremcount_${us}`) || 0;
                    let spremown = await client.db.get(`spremown_${message.guild.id}`)
                        .then((r) => client.db.get(`upremend_${r}`));

                    await client.db.delete(`sprem_${message.guild.id}`);
                    await client.db.delete(`spremend_${message.guild.id}`);

                    if (spremown && Date.now() > spremown) {
                        await client.db.delete(`upremcount_${us}`);
                        await client.db.delete(`uprem_${us}`);
                        await client.db.delete(`upremend_${us}`);

                        for (let i = 0; i < upremserver.length; i++) {
                            scount += 1;
                            await client.db.delete(`sprem_${upremserver[i]}`);
                            await client.db.delete(`spremend_${upremserver[i]}`);
                            await client.db.delete(`spremown_${upremserver[i]}`);
                        }
                        
                        try {
                            const user = await client.users.fetch(us).catch(() => null);
                            if (user) {
                                await user.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor(client.color)
                                            .setDescription(
                                                `Your Premium Has Expired.\nTotal **\`${scount}\`** Server Premiums were removed.\nClick [here](${slink}) To Buy Premium.`
                                            )
                                    ],
                                    components: [premrow]
                                }).catch(() => {});
                            }
                        } catch (error) {
                            console.error('Failed to send server premium expiration DM:', error);
                        }
                    }
                    
                    await client.db.delete(`upremserver_${us}`);
                    await client.db.delete(`spremown_${message.guild.id}`);
                    
                    try {
                        await message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `The Premium Of This Server Has Expired.\nClick [here](${slink}) To Buy Premium.`
                                    )
                            ],
                            components: [premrow]
                        }).catch(() => {});
                    } catch (channelError) {
                        console.error('Failed to send premium expiration message:', channelError);
                    }
                } catch (serverPremiumError) {
                    console.error('Error handling server premium expiration:', serverPremiumError);
                }
            }

            // Button row for invites
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setLabel(`Invite Me`)
                    .setStyle('LINK')
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`),
                new MessageButton()
                    .setLabel(`Support`)
                    .setStyle('LINK')
                    .setURL(`https://discord.com/invite/lunardevs`)
            );

            // Utility functions with error handling
            try {
                client.util.setPrefix(message, client);
                client.util.noprefix();
                client.util.blacklist();
            } catch (utilError) {
                console.error('Utility function error:', utilError);
            }

            // Blacklist check
            let blacklistdb = client.blacklist || [];
            if (blacklistdb.includes(message.author.id) && !client.config.owner.includes(message.author.id)) {
                return;
            }

            // Bot mention response
            try {
                let user = await client.users.fetch(`1243888482355511328`).catch(() => null);
                
                const botMention = `<@${client.user.id}>`;
                const isMentioned = message.content.startsWith(botMention);
                
                if (message.content === botMention) {
                    client.util.setPrefix(message, client);
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setAuthor({
                                    name: `I'm ${client.user.username}`,
                                    iconURL: client.user.displayAvatarURL({dynamic: true})
                                })
                                .setColor('#E6B800')
                                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                                .setDescription(
                                    `Hey [${message.author.username}](https://discord.com/users/${message.author.id})\nPrefix For This Server Is \`${message.guild.prefix}\`\n\nUnlock More Details With \`${message.guild.prefix}help\`.`
                                )
                                .setFooter({
                                    text: `FyZen Supremacy`,
                                    iconURL: user?.displayAvatarURL({ dynamic: true }) || client.user.displayAvatarURL()
                                })
                        ],
                        components: [row]
                    }).catch(() => {});
                }
            } catch (mentionError) {
                console.error('Error handling bot mention:', mentionError);
            }

            // Command handling
            let prefix = message.guild.prefix || '$';
            let datab = client.noprefix || [];
            const mentionRegex = new RegExp(`<@!?${client.user.id}>`);
            let isMention = mentionRegex.test(message.content);
            
            if (isMention) {
                message.content = message.content.replace(mentionRegex, '');
            }
            
            const isNoPrefixUser = datab.some(user => user.userId === message.author.id);
            const startsWithPrefix = message.content.startsWith(prefix);
            
            if (!isMention && !isNoPrefixUser && !message.content.startsWith(prefix)) {
                return;
            }
            
            const args = datab.includes(message.author.id) || message.content.startsWith(prefix)
                ? message.content.slice(prefix.length).trim().split(/ +/)
                : message.content.trim().split(/ +/);
            
            const cmd = args.shift()?.toLowerCase();
            
            if (!cmd) return;
            
            const command = client.commands.get(cmd.toLowerCase()) ||
                client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
            
            // Premium command check
            if (command && command.premium) {
                if (!'760143551920078861'.includes(message.author.id) && !uprem && !sprem) {
                    const row = new MessageActionRow().addComponents(
                        new MessageButton()
                            .setLabel('Invite')
                            .setStyle('LINK')
                            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`),
                        new MessageButton()
                            .setLabel('Premium')
                            .setStyle('LINK')
                            .setURL('https://discord.gg/lunardevs')
                    );
                    
                    const embeds = new MessageEmbed()
                        .setDescription('You Just Discovered a Premium Command Join Our Support Server To Buy Premium')
                        .setColor(client.color);
                    
                    return message.channel.send({
                        embeds: [embeds],
                        components: [row]
                    }).catch(() => {});
                }
            }

            // Custom role commands
            try {
                let customdata = await client.db.get(`customrole_${message.guild.id}`);
                
                if (customdata) {
                    for (let index = 0; index < customdata.names.length; index++) {
                        const data = customdata.names[index];
                        
                        if ((!datab.includes(message.author.id) && message.content.startsWith(prefix) && cmd === data) ||
                            (datab.includes(message.author.id) && !message.content.startsWith(prefix) && cmd === data) ||
                            (datab.includes(message.author.id) && message.content.startsWith(prefix) && cmd === data) ||
                            (isMentioned && cmd === data)) {
                            
                            const ignore = (await client.db?.get(`ignore_${message.guild.id}`)) ?? { channel: [], role: [] };
                            
                            if (ignore.channel.includes(message.channel.id) &&
                                !message.member.roles.cache.some((role) => ignore.role.includes(role.id))) {
                                const response = await message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#E6B800')
                                            .setDescription(
                                                `Apologies, I can't execute commands in this channel as it's currently on my ignore list. Please consider selecting a different channel or contacting the server administrator for support.`
                                            )
                                    ]
                                }).catch(() => null);
                                
                                if (response) {
                                    setTimeout(() => response.delete().catch(() => {}), 3000);
                                }
                                return;
                            }
                            
                            let role;
                            try {
                                role = await message.guild.roles.fetch(customdata.roles[index]);
                            } catch (roleError) {
                                console.error('Failed to fetch role:', roleError);
                                role = null;
                            }
                            
                            if (!customdata.reqrole) {
                                return message.channel.send({
                                    content: `**Attention:** Before using custom commands, please set up the required role.`,
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#E6B800')
                                            .setTitle('Required Role Setup')
                                            .setDescription(
                                                `To enable custom commands, you need to set up a specific role that users must have to access these commands.\nUse the command to set the required role: \n\`${message.guild.prefix}setup reqrole @YourRequiredRole/id\``
                                            )
                                            .setTimestamp()
                                    ]
                                }).catch(() => {});
                            }
                            
                            if (!message.guild.roles.cache.has(customdata.reqrole)) {
                                const customData = (await client.db?.get(`customrole_${message.guild.id}`)) || { names: [], roles: [], reqrole: null };
                                customData.reqrole = null;
                                await client.db?.set(`customrole_${message.guild.id}`, customData);
                                
                                return message.channel.send({
                                    content: `**Warning:** The required role may have been deleted from the server. I am clearing the associated data from the database.`,
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#E6B800')
                                            .setTitle('Database Update')
                                            .setDescription(
                                                `This action is taken to maintain consistency. Please ensure that server roles are managed appropriately.`
                                            )
                                            .setFooter('If you encounter issues, contact a server administrator.')
                                    ]
                                }).catch(() => {});
                            }
                            
                            if (!message.member.roles.cache.has(customdata.reqrole)) {
                                return message.channel.send({
                                    content: `**Access Denied!**`,
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#E6B800')
                                            .setTitle('Permission Error')
                                            .setDescription(
                                                `You do not have the required role to use custom commands.`
                                            )
                                            .addField('Required Role:', `<@&${customdata.reqrole}>`)
                                            .setFooter('Please contact a server administrator for assistance.')
                                    ]
                                }).catch(() => {});
                            }
                            
                            if (!role) {
                                const roleIndex = customdata.names.indexOf(args[-1]);
                                customdata.names.splice(roleIndex, 1);
                                customdata.roles.splice(roleIndex, 1);

                                await client.db?.set(`customrole_${message.guild.id}`, customdata);
                                
                                return message.channel.send({
                                    content: `**Warning:** The specified role was not found, possibly deleted. I am removing associated data from the database.`,
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#E6B800')
                                            .setTitle('Database Cleanup')
                                            .setDescription(
                                                `To maintain accurate records, the associated data is being removed. Ensure roles are managed properly to prevent future issues.`
                                            )
                                            .setFooter('Contact a server administrator if you encounter any problems.')
                                    ]
                                }).catch(() => {});
                            } else if (role && (
                                role.permissions.has('KICK_MEMBERS') ||
                                role.permissions.has('BAN_MEMBERS') ||
                                role.permissions.has('ADMINISTRATOR') ||
                                role.permissions.has('MANAGE_CHANNELS') ||
                                role.permissions.has('MANAGE_GUILD') ||
                                role.permissions.has('MENTION_EVERYONE') ||
                                role.permissions.has('MANAGE_ROLES') ||
                                role.permissions.has('MANAGE_WEBHOOKS') ||
                                role.permissions.has('MANAGE_EVENTS') ||
                                role.permissions.has('MODERATE_MEMBERS') ||
                                role.permissions.has('MANAGE_EMOJIS_AND_STICKERS')
                            )) {
                                const array = [
                                    'KICK_MEMBERS', 'BAN_MEMBERS', 'ADMINISTRATOR',
                                    'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MENTION_EVERYONE',
                                    'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EVENTS',
                                    'MODERATE_MEMBERS', 'MANAGE_EMOJIS_AND_STICKERS'
                                ];

                                const removePermissionsButton = new MessageButton()
                                    .setLabel('Remove Permissions')
                                    .setStyle('DANGER')
                                    .setCustomId('remove_permissions');

                                const row = new MessageActionRow().addComponents(removePermissionsButton);
                                
                                const initialMessage = await message.channel.send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setColor('#E6B800')
                                            .setDescription(
                                                `${client.emoji.cross} | **Permission Denied**\nI cannot add <@&${role.id}> to anyone because it possesses the following restricted permissions:\n${
                                                    new Permissions(role.permissions.bitfield)
                                                        .toArray()
                                                        .filter((a) => array.includes(a))
                                                        .map((arr) => `• \`${arr}\``)
                                                        .join('\n')
                                                }\nPlease review and adjust the role permissions accordingly.`
                                            )
                                    ],
                                    components: [row]
                                }).catch(() => null);

                                if (!initialMessage) return;

                                const filter = interaction => interaction.customId === 'remove_permissions' && 
                                    interaction.user.id === message.author.id;

                                const collector = message.channel.createMessageComponentCollector({ 
                                    filter, 
                                    time: 15000 
                                });

                                collector.on('collect', async (interaction) => {
                                    if (!filter(interaction)) {
                                        return interaction.reply({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor('#E6B800')
                                                    .setDescription(
                                                        `${client.emoji.cross} | Only ${message.author} can use this button.`
                                                    )
                                            ],
                                            ephemeral: true
                                        }).catch(() => {});
                                    }

                                    try {
                                        if (role.editable) {
                                            await role.setPermissions(
                                                [],
                                                `Action Done By ${interaction.user.username} Removed dangerous permissions from role`
                                            );
                                            
                                            await interaction.reply({
                                                embeds: [
                                                    new MessageEmbed()
                                                        .setColor('#E6B800')
                                                        .setDescription(
                                                            `${client.emoji.tick} | Permissions removed successfully.`
                                                        )
                                                ],
                                                ephemeral: true
                                            }).catch(() => {});
                                        } else {
                                            await interaction.reply({
                                                embeds: [
                                                    new MessageEmbed()
                                                        .setColor('#E6B800')
                                                        .setDescription(
                                                            `${client.emoji.cross} | I don't have sufficient permissions to clear permissions from the role. Please make sure my role position is higher than the role you're trying to modify.`
                                                        )
                                                ],
                                                ephemeral: true
                                            }).catch(() => {});
                                        }
                                    } catch (permissionError) {
                                        console.error('Error modifying role permissions:', permissionError);
                                        interaction.reply({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor('#E6B800')
                                                    .setDescription(
                                                        `${client.emoji.cross} | An error occurred while trying to modify the role permissions.`
                                                    )
                                            ],
                                            ephemeral: true
                                        }).catch(() => {});
                                    }
                                });

                                collector.on('end', () => {
                                    try {
                                        removePermissionsButton.setDisabled(true);
                                        initialMessage.edit({
                                            components: [
                                                new MessageActionRow().addComponents([removePermissionsButton])
                                            ]
                                        }).catch(() => {});
                                    } catch (editError) {
                                        console.error('Error disabling button:', editError);
                                    }
                                });
                            } else {
                                let member = message.mentions.members.first() || 
                                    message.guild.members.cache.get(args[0]);
                                
                                if (!member) {
                                    return message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor('#E6B800')
                                                .setTitle('Invalid Member')
                                                .setDescription(
                                                    `Make sure to mention a valid member or provide their ID.`
                                                )
                                        ]
                                    }).catch(() => {});
                                }
                                
                                if (!role.editable) {
                                    await message.channel.send({
                                        embeds: [
                                            new MessageEmbed()
                                                .setColor('#E6B800')
                                                .setDescription(
                                                    `${client.emoji.cross} | I can't provide this role as my highest role is either below or equal to the provided role.`
                                                )
                                        ]
                                    }).catch(() => {});
                                } else if (member.roles.cache.has(role.id)) {
                                    try {
                                        await member.roles.remove(
                                            role.id,
                                            `${message.author.tag} | ${message.author.id}`
                                        );
                                        
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor('#E6B800')
                                                    .setDescription(
                                                        `${client.emoji.tick} | The role ${role} has been successfully removed from ${member}`
                                                    )
                                            ]
                                        }).catch(() => {});
                                    } catch (removeError) {
                                        console.error('Error removing role:', removeError);
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor('#E6B800')
                                                    .setDescription(
                                                        `${client.emoji.cross} | Failed to remove the role from ${member}.`
                                                    )
                                            ]
                                        }).catch(() => {});
                                    }
                                } else {
                                    try {
                                        await member.roles.add(
                                            role.id,
                                            `${message.author.tag} | ${message.author.id}`
                                        );
                                        
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor('#E6B800')
                                                    .setDescription(
                                                        `${client.emoji.tick} | The role ${role} has been successfully added to ${member}`
                                                    )
                                            ]
                                        }).catch(() => {});
                                    } catch (addError) {
                                        console.error('Error adding role:', addError);
                                        return message.channel.send({
                                            embeds: [
                                                new MessageEmbed()
                                                    .setColor('#E6B800')
                                                    .setDescription(
                                                        `${client.emoji.cross} | Failed to add the role to ${member}.`
                                                    )
                                            ]
                                        }).catch(() => {});
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (customRoleError) {
                console.error('Error in custom role handling:', customRoleError);
            }

            if (!command) return;

            // Ignore list check
            const ignore = (await client.db?.get(`ignore_${message.guild.id}`)) ?? { channel: [], role: [] };
            if (ignore.channel.includes(message.channel.id) &&
                !message.member.roles.cache.some((role) => ignore.role.includes(role.id))) {
                const response = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#E6B800')
                            .setDescription(
                                `Apologies, I can't execute commands in this channel as it's currently on my ignore list. Please consider selecting a different channel or contacting the server administrator for support.`
                            )
                    ]
                }).catch(() => null);
                
                if (response) {
                    setTimeout(() => response.delete().catch(() => {}), 3000);
                }
                return;
            }

            message.guild.prefix = prefix || '&';

            // Command cooldown handling
            const commandLimit = 5;
            if (client.config.cooldown && !client.config.owner.includes(message.author.id)) {
                if (!client.cooldowns.has(command.name)) {
                    client.cooldowns.set(command.name, new Collection());
                }
                
                const now = Date.now();
                const timestamps = client.cooldowns.get(command.name);
                const cooldownAmount = (command.cooldown ? command.cooldown : 3) * 1000;
                
                if (timestamps.has(message.author.id)) {
                    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                    
                    if (now < expirationTime) {
                        const timeLeft = (expirationTime - now) / 1000;
                        let commandCount = timestamps.get(`${message.author.id}_count`) || 0;
                        commandCount++;
                        timestamps.set(`${message.author.id}_count`, commandCount);
                        
                        if (!timestamps.get(`${message.author.id}_cooldown_sent`)) {
                            timestamps.set(`${message.author.id}_cooldown_sent`, true);
                            
                            message.channel.send({
                                embeds: [
                                    new MessageEmbed()
                                        .setColor('#E6B800')
                                        .setDescription(
                                            `Please wait, this command is on cooldown for \`${timeLeft.toFixed(1)}s\``
                                        )
                                ]
                            })
                            .then((msg) => {
                                setTimeout(() => msg.delete().catch(() => {}), 5000);
                            })
                            .catch(() => {});
                        }
                        return;
                    }
                }
                
                timestamps.set(message.author.id, now);
                timestamps.set(`${message.author.id}_count`, 1);
                
                setTimeout(() => {
                    timestamps.delete(message.author.id);
                    timestamps.delete(`${message.author.id}_count`);
                    timestamps.delete(`${message.author.id}_cooldown_sent`);
                }, cooldownAmount);
            }

            // Execute command with error handling
            try {
                await command.run(client, message, args);
                
                // Command logging
                if (command && command.run) {
                    try {
                        const weboo = new WebhookClient({
                            url: `https://ptb.discord.com/api/webhooks/1345379753586065468/OAeOYQVNoN68uC7mRgBP-M45X-tP2G6HfYwienPasXpzMaknCarcF7W9fsi7eiar0oQD`
                        });
                        
                        const commandlog = new MessageEmbed()
                            .setAuthor(
                                message.author.tag,
                                message.author.displayAvatarURL({ dynamic: true })
                            )
                            .setColor('#E6B800')
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()
                            .setDescription(
                                `Command Ran In : \`${message.guild.name} | ${message.guild.id}\`\nCommand Ran In Channel : \`${message.channel.name} | ${message.channel.id}\`\nCommand Name : \`${command.name}\`\nCommand Executor : \`${message.author.tag} | ${message.author.id}\`\nCommand Content : \`${message.content}\``
                            );
                        
                        weboo.send({ embeds: [commandlog] }).catch((webhookError) => {
                            console.error('Failed to send command log:', webhookError);
                        });
                    } catch (logError) {
                        console.error('Command logging error:', logError);
                    }
                }
            } catch (commandError) {
                console.error(`Error executing command ${command.name}:`, commandError);
                
                // Handle rate limits specifically
                if (commandError.code === 429) {
                    try {
                        await client.util.handleRateLimit();
                    } catch (rateLimitError) {
                        console.error('Failed to handle rate limit:', rateLimitError);
                    }
                } else {
                    // Send error message to user
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor('#E6B800')
                                .setDescription(
                                    `${client.emoji.cross} | An error occurred while executing this command. Please try again later.`
                                )
                        ]
                    }).catch(() => {});
                }
            }
        } catch (err) {
            console.error('Unhandled error in messageCreate event:', err);
            
            if (err.code === 429) {
                try {
                    await client.util.handleRateLimit();
                } catch (rateLimitError) {
                    console.error('Failed to handle rate limit:', rateLimitError);
                }
            }
        }
    });
};