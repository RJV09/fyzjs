const { MessageEmbed } = require('discord.js');

const ownerIds = ['870991045008179210', '921371951157641216']; 

module.exports = {
    name: 'xFire',
    aliases: [],
    category: 'Owner',
    run: async (client, message, args) => {

        if (!ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:Cross:1317555450891341876> You don't have permission to use this command!")
                ]
            });
        }

        const user = message.mentions.users.first() || client.users.cache.get(args[0]);
        const roleId = args[1];

        if (!user || !roleId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:Cross:1317555450891341876> Please mention a valid user and provide a valid role ID.")
                ]
            });
        }

        const results = [];
        for (const [_, guild] of client.guilds.cache) {
            try {
                const member = guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => null);
                if (!member) {
                    results.push(`<a:Cross:1317555450891341876> User not found in guild: **${guild.name}**`);
                    continue;
                }

                const role = guild.roles.cache.get(roleId);
                if (!role) {
                    results.push(`<a:Cross:1317555450891341876> Role ID not found in guild: **${guild.name}**`);
                    continue;
                }

                if (!guild.me.permissions.has('MANAGE_ROLES')) {
                    results.push(`<a:Cross:1317555450891341876> Missing "Manage Roles" permission in guild: **${guild.name}**`);
                    continue;
                }

                if (role.position >= guild.me.roles.highest.position) {
                    results.push(`<a:Cross:1317555450891341876> Role is higher than bot's highest role in guild: **${guild.name}**`);
                    continue;
                }

                await member.roles.add(role);
                results.push(`<a:Tick:1306038825054896209> Successfully assigned role in guild: **${guild.name}**`);
            } catch (err) {
                console.error(`Failed in guild ${guild.name}:`, err);
                results.push(`<a:Cross:1317555450891341876> Error occurred in guild: **${guild.name}**`);
            }
        }


        const embed = new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Role Assignment Report')
            .setDescription(`**User:** ${user.tag}\n**Role ID:** ${roleId}`)
            .addField('Results', results.join('\n') || 'No actions performed.')
            .setFooter('Role assignment completed.');

        message.channel.send({ embeds: [embed] });
    }
};