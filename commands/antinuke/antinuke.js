const { MessageEmbed } = require('discord.js')
let enable = `<:stolen_emoji:1336671875425636363><a:stolen_emoji:1330526992298414131>`
let disable = `<:stolen_emoji:1336672584309280900><:stolen_emoji:1336672797820321812>`
let protect = `<a:stolen_emoji:1330513586866356254>`
let hii = `<a:Red_Arrow_Right:1306037499185074218>`
const wait = require('wait')
module.exports = {
    name: 'antinuke',
    aliases: ['antiwizz', 'an'],
    category: 'security',
    premium: true,
    run: async (client, message, args) => {
         if (message.guild.memberCount < 1) {
          return message.channel.send({
                 embeds: [
                     new MessageEmbed()
                         .setColor(client.color)
                         .setDescription(
                             `${client.emoji.cross} | Your server does not meet the requirements for accommodating my 30-member criteria.`
                         )
                 ]
             })
     }
        let own = message.author.id == message.guild.ownerId
        const check = await client.util.isExtraOwner(
            message.author,
            message.guild
        )
        if (!own && !check) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(
                            `${client.emoji.cross} | Only the server owner or an additional owner is authorized to run this command.`
                        )
                ]
            })
        }
        if (
            !own &&
            !(
                message?.guild.members.cache.get(client.user.id).roles.highest
                    .position <= message?.member?.roles?.highest.position
            )
        ) {
            const higherole = new MessageEmbed()
                .setColor(client.color)
                .setDescription(
                    `${client.emoji.cross} | Only the server owner or an extra owner with a higher role than mine is authorized to run this command.`
                )
            return message.channel.send({ embeds: [higherole] })
        }

        let prefix = '&' || message.guild.prefix
        const option = args[0]
        const isActivatedAlready = await client.db.get(
            `${message.guild.id}_antinuke`
        )
        const antinuke = new MessageEmbed()
            .setThumbnail(client.user.avatarURL({ dynamic: true }))
            .setColor(client.color)
            .setTitle(`__**Antinuke**__`)
            .setDescription(
                `Level up your server security with Antinuke! It swiftly bans admins engaging in suspicious activities, all while safeguarding your whitelisted members. Enhance protection – enable Antinuke now!`
            )
            .addFields([
                {
                    name: `__**Antinuke Enable**__`,
                    value: `To Enable Antinuke, Use - \`${prefix}antinuke enable\``
                },
                {
                    name: `__**Antinuke Disable**__`,
                    value: `To Disable Antinuke, Use - \`${prefix}antinuke disable\``
                }
            ])

        {
            if (!option) {
                message.channel.send({ embeds: [antinuke] })
            } else if (option === 'enable') {
                if (isActivatedAlready) {
                    const enabnble = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server has already enabled security\n\nCurrent Status : ${enable}\nTo Disable use ${prefix}antinuke disable**`
                        )
                    message.channel.send({ embeds: [enabnble] })
                } else {
                    await client.db.set(`${message.guild.id}_antinuke`, true)
                    await client.db.set(`${message.guild.id}_wl`, {
                        whitelisted: []
                    })
                    const enabled = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setAuthor({
                            name: `${client.user.username} Security`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}**\n\n` +
                            `Tip: To optimize the functionality of my Anti-Nuke Module, please move my role to the top of the roles list.\n\n` +
                            `**__Modules Enabled__**\n` +
                            `**Anti Ban**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Unban**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Kick**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Bot**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Channel Create**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Channel Delete**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Channel Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Emoji/Sticker Create**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Emoji/Sticker Delete**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Emoji/Sticker Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Everyone/Here Ping**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Link Role**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Role Create**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Role Delete**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Role Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Role Ping**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Member Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Integration**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Server Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Automod Rule Create**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Automod Rule Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Automod Rule Delete**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Guild Event Create**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Guild Event Update**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Guild Event Delete**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Anti Webhook**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n\n` +
                            `**Anti Prune**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>\n` +
                            `**Auto Recovery**: <:Fire_OP:1321774274406518784> <:Fire_OP:1321774246577442826>`
                          )
                          
                        .setFooter({
                            text: `Punishment Type: Ban`,
                            iconURL: message.author.displayAvatarURL({
                                dynamic: true
                            })
                        })

                    let msg = await message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(client.color)
                                .setDescription(`<a:Tick:1306038825054896209> | **Initializing Quick Setup!**`)
                    ]
                });
                const steps = ['**Checking FyZen role position for optimal configuration ....', 'Crafting and configuring the FyZen Dominance role..!**', '**Ensuring precise placement of the FyZen Dominance role...!**', '**Safeguarding your changes...!**','**Activating the Antinuke Modules for enhanced security...!!**'];
                for (const step of steps) {
                        await client.util.sleep(1000)
                        await msg.edit({
                            embeds: [
                                new MessageEmbed()
                                    .setColor(client.color)
                                    .setDescription(
                                        `${msg.embeds[0].description}\n${client.emoji.tick} | ${step}`
                                    )
                            ]
                        })
                    }
                    await client.util.sleep(2000)
                    await msg.edit({ embeds: [enabled] })
                    if (message.guild.roles.cache.size > 249)
                        return message.reply(
                            `I Won't Able To Create \`FyZen Dominance\` Cause There Are Already 249 Roles In This Server`
                        )
                    let role = message?.guild.members.cache.get(client.user.id)
                        .roles.highest.position
                    let createdRole = await message.guild.roles.create({
                        name: 'FyZen Dominance',
                        position: role ? role : 0,
                        reason: 'FyZen Role For Ubypassable Setup',
                        permissions: ['ADMINISTRATOR'],
                        color: '#ff0000'
                    })
                    await message.guild.me.roles.add(createdRole.id)
                }
            } else if (option === 'disable') {
                if (!isActivatedAlready) {
                    const dissable = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}\nUmm, looks like your server hasn't enabled security.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}antinuke enable**`
                        )
                    message.channel.send({ embeds: [dissable] })
                } else {
                    await client.db
                        .get(`${message.guild.id}_wl`)
                        .then(async (data) => {
                            const users = data.whitelisted
                            let i
                            for (i = 0; i < users.length; i++) {
                                let data2 = await client.db?.get(
                                    `${message.guild.id}_${users[i]}_wl`
                                )
                                if (data2) {
                                    await client.db?.delete(
                                        `${message.guild.id}_${users[i]}_wl`
                                    )
                                }
                            }
                        })
                    await client.db.set(`${message.guild.id}_antinuke`, null)
                    await client.db.set(`${message.guild.id}_wl`, {
                        whitelisted: []
                    })
                    const disabled = new MessageEmbed()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .setDescription(
                            `**Security Settings For ${message.guild.name} ${protect}\nSuccessfully disabled security settings for this server.\n\nCurrent Status: ${disable}\n\nTo Enable use ${prefix}antinuke enable**`
                        )
                    message.channel.send({ embeds: [disabled] })
                }
            } else {
                return message.channel.send({ embeds: [antinuke] })
            }
        }
    }
}
