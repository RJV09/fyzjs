const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, Permissions } = require('discord.js');

module.exports = {
    name: 'j2csetup',
    description: 'Sets up the Join to Create System.',
    category: 'j2c',
    premium: false,
    run: async (client, message) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('RED').setDescription('❌ You need `Manage Channels` permission.')]
            });
        }

        let category = await message.guild.channels.create('Fire Temp Voice', { type: 'GUILD_CATEGORY' });

        const controlChannel = await message.guild.channels.create('Fire-control', { type: 'GUILD_TEXT', parent: category.id });
        const joinChannel = await message.guild.channels.create('Join to Create', { type: 'GUILD_VOICE', parent: category.id });

        message.channel.send({
            embeds: [new MessageEmbed().setColor('GREEN').setDescription('✅ Setup complete! Use "Join to Create" to generate temp VCs.')]
        });

        const embed = new MessageEmbed()
            .setColor('YELLOW')
            .setTitle('🔥 Fire Interface')
            .setDescription('Use this interface to manage your VC.')
            .setThumbnail(client.user.displayAvatarURL()) 
            .setImage('https://i.postimg.cc/Jn4hr181/FyZen-word-graffiti-style-letters-hand-drawn-doodle-cartoon-logo-FyZen-illustration-print-for-poster-t.jpg') 
            .setFooter('Use the buttons below to manage your VC');

        const row1 = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('lock').setLabel('🔒 Lock').setStyle('SECONDARY'),
            new MessageButton().setCustomId('unlock').setLabel('🔓 Unlock').setStyle('SECONDARY'),
            new MessageButton().setCustomId('hide').setLabel('🙈 Hide').setStyle('SECONDARY'),
            new MessageButton().setCustomId('unhide').setLabel('👀 Unhide').setStyle('SECONDARY')
        );

        const row2 = new MessageActionRow().addComponents(
            new MessageButton().setCustomId('rename').setLabel('✏️ Rename').setStyle('SECONDARY'),
            new MessageButton().setCustomId('limit').setLabel('👥 Limit').setStyle('SECONDARY'),
            new MessageButton().setCustomId('bitrate').setLabel('🎵 Bitrate').setStyle('SECONDARY'),
            new MessageSelectMenu()
                .setCustomId('region')
                .setPlaceholder('🌍 Change VC Region')
                .addOptions([
                    { label: "Brazil", value: "brazil" },
                    { label: "Hong Kong", value: "hongkong" },
                    { label: "India", value: "india" },
                    { label: "Japan", value: "japan" },
                    { label: "Rotterdam", value: "rotterdam" },
                    { label: "Russia", value: "russia" },
                    { label: "Singapore", value: "singapore" },
                    { label: "South Africa", value: "southafrica" },
                    { label: "Sydney", value: "sydney" },
                    { label: "US Central", value: "us-central" },
                    { label: "US East", value: "us-east" },
                    { label: "US South", value: "us-south" },
                    { label: "US West", value: "us-west" }
                ])
        );

        const row3 = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('actions')
                .setPlaceholder('🔧 Manage VC')
                .addOptions([
                    { label: "Mute Member", value: "mute" },
                    { label: "Unmute Member", value: "unmute" },
                    { label: "Deafen Member", value: "deafen" },
                    { label: "Undeafen Member", value: "undeafen" },
                    { label: "Kick Member", value: "kick" },
                    { label: "Transfer Ownership", value: "transfer" }
                ])
        );

        await controlChannel.send({ embeds: [embed], components: [row1, row2, row3] });

        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isButton() && !interaction.isSelectMenu()) return;

            const member = interaction.member;
            const voiceChannel = member.voice.channel;
            if (!voiceChannel) {
                return interaction.reply({ content: '❌ You must be in a voice channel.', ephemeral: true });
            }

            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case 'lock':
                        await voiceChannel.permissionOverwrites.edit(message.guild.roles.everyone, { CONNECT: false });
                        interaction.reply({ content: '🔒 VC Locked.', ephemeral: true });
                        break;
                    case 'unlock':
                        await voiceChannel.permissionOverwrites.edit(message.guild.roles.everyone, { CONNECT: true });
                        interaction.reply({ content: '🔓 VC Unlocked.', ephemeral: true });
                        break;
                    case 'hide':
                        await voiceChannel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: false });
                        interaction.reply({ content: '🙈 VC Hidden.', ephemeral: true });
                        break;
                    case 'unhide':
                        await voiceChannel.permissionOverwrites.edit(message.guild.roles.everyone, { VIEW_CHANNEL: true });
                        interaction.reply({ content: '👀 VC Unhidden.', ephemeral: true });
                        break;
                }
            } else if (interaction.isSelectMenu()) {
                switch (interaction.customId) {
                    case 'actions':
                        const selected = interaction.values[0];
                        const target = voiceChannel.members.first();
                        if (!target) return interaction.reply({ content: '❌ No member found in VC.', ephemeral: true });

                        switch (selected) {
                            case 'mute':
                                await target.voice.setMute(true);
                                interaction.reply({ content: `🔇 ${target.user.tag} Muted.`, ephemeral: true });
                                break;
                            case 'unmute':
                                await target.voice.setMute(false);
                                interaction.reply({ content: `🔊 ${target.user.tag} Unmuted.`, ephemeral: true });
                                break;
                            case 'deafen':
                                await target.voice.setDeaf(true);
                                interaction.reply({ content: `🔕 ${target.user.tag} Deafened.`, ephemeral: true });
                                break;
                            case 'undeafen':
                                await target.voice.setDeaf(false);
                                interaction.reply({ content: `🔔 ${target.user.tag} Undeafened.`, ephemeral: true });
                                break;
                            case 'kick':
                                await target.voice.disconnect();
                                interaction.reply({ content: `👢 ${target.user.tag} Kicked from VC.`, ephemeral: true });
                                break;
                            case 'transfer':
                                await voiceChannel.permissionOverwrites.edit(target, { MANAGE_CHANNELS: true });
                                await voiceChannel.permissionOverwrites.edit(member, { MANAGE_CHANNELS: false });
                                interaction.reply({ content: `👑 Ownership transferred to ${target.user.tag}.`, ephemeral: true });
                                break;
                        }
                        break;

                    case 'region':
                        const newRegion = interaction.values[0];
                        await voiceChannel.setRTCRegion(newRegion);
                        interaction.reply({ content: `🌍 Region changed to **${newRegion.toUpperCase()}**.`, ephemeral: true });
                        break;
                }
            }
        });
    },
};
