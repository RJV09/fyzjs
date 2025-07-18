const { MessageEmbed } = require('discord.js');
const { addUserToBypass, removeUserFromBypass, getBypassList } = require('../../bypassManager');

module.exports = {
    name: 'bypass',
    description: 'Manage the bypass list for anti quickadmin',
    async run(client, message, args) {
        const option = args[0];

        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({ 
                content: "You do not have permission to use this command." 
            });
        }

        const bypassList = await getBypassList(message.guild.id);

        if (!option) {
            const guideEmbed = new MessageEmbed()
                  .setColor('#0099FF')
                   .setTitle('QuickadminBypass')
                    .setDescription(
                      `Manage the bypass settings for QuickadminBypass! You can add or remove users from the bypass list.`
                         )
                      .addFields([
                      {
                                name: `__**Add Bypass User**__`,
                      value: `To add a user to the bypass list, use \`${prefix}bypassadd <user>\`.`
                     },
                       {
                            name: `__**Remove Bypass User**__`,
                          value: `To remove a user from the bypass list, use \`${prefix}bypassremove <user>\`.`
                     }
    ]);

    

            if (bypassList.length === 0) {
                return message.channel.send({
                    embeds: [
                        guideEmbed.addField('Current Bypass List:', 'There are no users in the bypass list.')
                    ]
                });
            }

            return message.channel.send({
                embeds: [
                    guideEmbed.addField('Current Bypass List:', 
                        bypassList.map(id => `<@${id}>`).join('\n') || 'No users in the bypass list.')
                ]
            });
        }

        if (option === 'add') {
            const userToAdd = message.mentions.users.first();
            if (!userToAdd) {
                return message.channel.send({ 
                    content: "Please mention a user to add to the bypass list." 
                });
            }

            if (bypassList.includes(userToAdd.id)) {
                return message.channel.send({
                    content: `${userToAdd.tag} is already in the bypass list.`
                });
            }

            await addUserToBypass(message.guild.id, userToAdd.id);

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#00FF00')
                        .setDescription(`${userToAdd.tag} has been added to the bypass list.`)
                ]
            });
        }

        if (option === 'remove') {
            const userToRemove = message.mentions.users.first();
            if (!userToRemove) {
                return message.channel.send({ 
                    content: "Please mention a user to remove from the bypass list." 
                });
            }

            if (!bypassList.includes(userToRemove.id)) {
                return message.channel.send({
                    content: `${userToRemove.tag} is not in the bypass list.`
                });
            }

            await removeUserFromBypass(message.guild.id, userToRemove.id);

            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#FF0000')
                        .setDescription(`${userToRemove.tag} has been removed from the bypass list.`)
                ]
            });
        }

        if (option === 'list') {
            if (bypassList.length === 0) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('#FF0000')
                            .setDescription('There are no users in the bypass list.')
                    ]
                });
            }

            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#00FF00')
                        .setTitle('Bypass List')
                        .setDescription(`Users in the bypass list:\n${bypassList.map(id => `<@${id}>`).join('\n')}`)
                ]
            });
        }
    }
};
