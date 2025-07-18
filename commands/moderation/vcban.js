const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'vcban',
    description: 'Ban a user from voice channels.',
    permissions: ['MODERATE_MEMBERS'], // ✅ Required for voice moderation
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MODERATE_MEMBERS')) {
            return message.reply({ embeds: [new MessageEmbed()
                .setColor('RED')
                .setTitle('❌ Permission Denied')
                .setDescription('You do not have permission to use this command.')
            ]});
        }

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) {
            return message.reply({ embeds: [new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('⚠️ Invalid User')
                .setDescription('Please mention a valid member or provide their ID.')
            ]});
        }

        // ✅ Check if the user is in a voice channel
        if (!target.voice.channel) {
            return message.reply({ embeds: [new MessageEmbed()
                .setColor('ORANGE')
                .setTitle('⚠️ User Not in VC')
                .setDescription(`${target.user.tag} is not connected to a voice channel.`)
            ]});
        }

        // ✅ Check if the bot has permission to moderate VC
        if (!message.guild.me.permissions.has('MOVE_MEMBERS')) {
            return message.reply({ embeds: [new MessageEmbed()
                .setColor('RED')
                .setTitle('❌ Missing Permission')
                .setDescription('I do not have permission to move or mute members in voice channels.')
            ]});
        }

        try {
            await target.voice.setSuppressed(true); // ✅ VC ban the user
            return message.reply({ embeds: [new MessageEmbed()
                .setColor('GREEN')
                .setTitle('✅ Voice Ban Successful')
                .setDescription(`${target.user.tag} has been voice banned.`)
            ]});
        } catch (error) {
            console.error('Error muting user:', error);
            return message.reply({ embeds: [new MessageEmbed()
                .setColor('RED')
                .setTitle('❌ Failed to Voice Ban')
                .setDescription('An error occurred while trying to voice ban the user.')
            ]});
        }
    }
};
