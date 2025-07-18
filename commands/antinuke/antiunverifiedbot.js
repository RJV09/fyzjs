const { MessageEmbed } = require('discord.js');
const antiUnverifiedBotListener = require('../../events/antiunverifiedbotListener.js'); 

let enable = `<a:Tick:1306038825054896209><a:xo_cross:1306036160484868107> `;
let disable = `<a:xo_cross:1306036160484868107> <a:Tick:1306038825054896209>`;
let protect = `<a:emoji_1725906102472:1306041362466078730>`;
let hii = `<a:emoji_1725906997325:1306050585404903424>`;

module.exports = {
    name: 'antiunverifiedbot',
    aliases: ['aub', 'antiub'],
    category: 'security',
    premium: false,
    run: async (client, message, args) => {
        if (message.guild.memberCount < 1) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<a:anxCross2:1321773462699642991>  | **Your server doesn't meet my requirement of having at least 10 members**`)
                ]
            });
        }

        let own = message.author.id == message.guild.ownerId;
        const check = await client.util.isExtraOwner(message.author, message.guild);
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`<a:anxCross2:1321773462699642991>  | **Only the server owner or another owner with a higher role than mine is allowed to run this command**`)
                ]
            });
        }

        if (!own && !(message?.guild.members.cache.get(client.user.id).roles.highest.position <= message?.member?.roles?.highest.position)) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(`<a:anxCross2:1321773462699642991>  | **You don't have permission to run this command.**`);
            return message.channel.send({ embeds: [higherole] });
        }

        let prefix = '$' || message.guild.prefix;
        const option = args[0];
        const isActivatedAlready = await client.db.get(`${message.guild.id}_antiunverifiedbot`);

        let configEmbed;
        if (isActivatedAlready) {
            configEmbed = new MessageEmbed()
                .setThumbnail(client.user.displayAvatarURL())
                .setAuthor({
                    name: `${client.user.username} Security`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor(client.color)
                .setDescription(
                    `**Security Settings For ${message.guild.name} ${protect}**\n\nTip: **To improve the effectiveness of my Anti-Unverified Bot Module, please move my role to the top of the roles list.** ${hii}\n\n***__Modules Enabled__*** ${protect}\n**Anti Unverified Bot: ${enable}**\n\n**__Other Security Modules__** (Keep your server safe!)`
                );
        } else {
            configEmbed = new MessageEmbed()
                .setThumbnail(client.user.displayAvatarURL())
                .setAuthor({
                    name: `${client.user.username} Security`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor(client.color)
                .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\n\nTip: **To improve the effectiveness of my Anti-Unverified Bot Module, please move my role to the top of the roles list..** ${hii}\n\n***__Modules Disabled__*** ${protect}\n**To enable Anti-Unverified Bot, use \`${prefix}antiunverifiedbot enable\`**`);
        }

        configEmbed.setFooter({
            text: `Punishment Type: Ban`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

        const antiunverifiedbot = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(` Anti-Unverified Bot Protection`)
            .setDescription(`**Enhance your server's security by preventing unverified bots from joining your server. Bots that are unverified will be banned instantly.**`)
            .addFields(
                {
                    name: ` Enable Anti-Unverified Bot`,
                    value: `**To enable Anti-Unverified Bot, use \`${prefix}antiunverifiedbot enable\`**`
                },
                {
                    name: ` Disable Anti-Unverified Bot`,
                    value: `**To disable Anti-Unverified Bot, use \`${prefix}antiunverifiedbot disable\`**`
                },
                {
                    name: ` Anti-Unverified Bot Configuration`,
                    value: `**To view or configure Anti-Unverified Bot settings, use** \`${prefix}antiunverifiedbot config\``
                }
            );

        if (!option) {
            message.channel.send({ embeds: [antiunverifiedbot] });
        } else if (option === 'enable') {
            if (isActivatedAlready) {
                const enableEmbed = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setTitle(`Security Settings For ${message.guild.name} ${protect}`)
                    .setDescription(`**It appears that your server has already activated Anti-Unverified Bot.\n\n**Current Status:** ${enable}\nTo Disable, use ${prefix}antiunverifiedbot disable**`);
                message.channel.send({ embeds: [enableEmbed] });
            } else {
                await client.db.set(`${message.guild.id}_antiunverifiedbot`, true);

                const enabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}**\n\n**Anti-Unverified Bot is Now Enabled**`)
                    .setFooter({
                        text: `Punishment Type: Ban`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    });
                let msg = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(`<a:Tick:1306038825054896209> | **Initializing Quick Setup!**`)
                    ]
                });
                const steps = ['**Checking Unverified Bots In Server ....', 'Kicking Unverified Bots….!**', '**Ensuring Database for antiunverified….!**', '**Configuring Antiunverified….!**','**Activating Antiunverifiedbot…..!**'];
                for (const step of steps) {
                    await client.util.sleep(1000);
                    await msg.edit({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(`${msg.embeds[0].description}\n${client.emoji.tick} | ${step}`)
                        ]
                    });
                }
                await client.util.sleep(2000);
                await msg.edit({ embeds: [enabled] });

                if (message.guild.roles.cache.size > 285)
                    return message.reply(`I Won't Able To Create \`Fire-Ubypassable\` Cause There Are Already 285 Roles In This Server`);

                let role = message?.guild.members.cache.get(client.user.id).roles.highest.position;
                let createdRole = await message.guild.roles.create({
                    name: 'ByPass ME!!',
                    position: role ? role : 0,
                    reason: 'Fire-Advance Role For Ubypassable Setup',
                    permissions: ['ADMINISTRATOR'],
                    color: '#ff0000'
                });
                await message.guild.me.roles.add(createdRole.id);
                    
            }
        } else if (option === 'disable') {
            if (!isActivatedAlready) {
                const dissable = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server hasn't enabled Anti-Unverified Bot.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}antiunverifiedbot enable**`);
                message.channel.send({ embeds: [dissable] });
            } else {
                await client.db.set(`${message.guild.id}_antiunverifiedbot`, null);

                const disabled = new MessageEmbed()
                    .setThumbnail(client.user.displayAvatarURL())
                    .setColor(client.color)
                    .setDescription(`**Security Settings For ${message.guild.name} ${protect}\nAnti-Unverified Bot has been successfully disabled for this server.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}antiunverifiedbot enable**`);
                message.channel.send({ embeds: [disabled] });
            }
        } else if (option === 'config') {
            message.channel.send({ embeds: [configEmbed] });
        } else {
            return message.channel.send({ embeds: [antiunverifiedbot] });
        }
    }
};
