const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['createembed'],
    category: 'mod',
    premium: false,
    usage: '/embed',
    run: async (client, message, args) => {
        let embedData = {
            title: "Default Title",
            description: "Default Description",
            color: "#3498db",
            footer: `Requested by ${message.author.tag}`,
            footerURL: message.author.displayAvatarURL({ dynamic: true }),
            thumbnail: null,
            image: null
        };

        function generateEmbed() {
            const newEmbed = new MessageEmbed()
                .setTitle(embedData.title)
                .setDescription(embedData.description)
                .setColor(embedData.color)
                .setFooter(embedData.footer, embedData.footerURL);
            if (embedData.thumbnail) newEmbed.setThumbnail(embedData.thumbnail);
            if (embedData.image) newEmbed.setImage(embedData.image);
            return newEmbed;
        }

        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('edit_title').setLabel('Edit Title').setStyle('PRIMARY'),
                new MessageButton().setCustomId('edit_description').setLabel('Edit Description').setStyle('PRIMARY'),
                new MessageButton().setCustomId('edit_footer').setLabel('Edit Footer').setStyle('PRIMARY'),
                new MessageButton().setCustomId('edit_footer_url').setLabel('Edit Footer Icon').setStyle('PRIMARY')
            );

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('edit_thumbnail').setLabel('Set Thumbnail').setStyle('SECONDARY'),
                new MessageButton().setCustomId('edit_image').setLabel('Set Image').setStyle('SECONDARY'),
                new MessageButton().setCustomId('edit_color').setLabel('Change Color').setStyle('SECONDARY')
            );

        const row3 = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('confirm_send').setLabel('Send Embed').setStyle('SUCCESS')
            );

        const msg = await message.channel.send({ embeds: [generateEmbed()], components: [row1, row2, row3] });

        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) return interaction.reply({ content: "You can't interact with this embed!", ephemeral: true });

            if (interaction.customId.startsWith('edit_')) {
                let fieldType = interaction.customId.replace('edit_', '');
                await interaction.reply({ content: `Please type the new **${fieldType}** in chat. Type **cancel** to stop.`, ephemeral: true });

                const filter = (m) => m.author.id === message.author.id;
                const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000 });

                if (!collected.size || collected.first().content.toLowerCase() === "cancel") {
                    return message.channel.send("❌ **Edit cancelled.**");
                }

                const userMessage = collected.first();
                const newValue = userMessage.content.trim();
                await userMessage.delete(); // Auto-delete user message

                if (fieldType === 'footer_url' || fieldType === 'thumbnail' || fieldType === 'image') {
                    if (!newValue.startsWith('http')) {
                        return message.channel.send("❌ **Invalid URL!** Please enter a valid image URL.");
                    }
                }

                if (fieldType === 'footer_url') {
                    embedData.footerURL = newValue;
                } else {
                    embedData[fieldType] = newValue;
                }

                await msg.edit({ embeds: [generateEmbed()] });
                message.channel.send(`✅ **${fieldType} updated!**`).then(msg => setTimeout(() => msg.delete(), 5000));
            } else if (interaction.customId === 'confirm_send') {
                await interaction.reply({ content: "📩 **Please mention the channel or provide the channel ID where you want to send the embed.**", ephemeral: true });

                const filter = (m) => m.author.id === message.author.id;
                const collected = await message.channel.awaitMessages({ filter, max: 1, time: 30000 });

                if (!collected.size) return message.channel.send("❌ **No channel mentioned. Embed sending cancelled.**");

                const userMessage = collected.first();
                const channelInput = userMessage.content.trim();
                await userMessage.delete(); // Auto-delete user message

                let targetChannel = message.mentions.channels.first() || message.guild.channels.cache.get(channelInput);

                if (!targetChannel || !targetChannel.isText()) {
                    return message.channel.send("❌ **Invalid channel! Please mention a text channel or provide a valid channel ID.**");
                }

                await targetChannel.send({ embeds: [generateEmbed()] });
                message.channel.send(`✅ **Embed sent to ${targetChannel}!**`).then(msg => setTimeout(() => msg.delete(), 5000));
                await msg.delete();
            }
        });
    }
};
