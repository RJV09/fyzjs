const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'reactionrole',
    aliases: ['rr'],
    category: 'moderation',
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_ROLES"))
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("❌ Insufficient Permissions")
                        .setDescription("You need `Manage Roles` permission to use this command!")
                        .setColor("#ff0000")
                ]
            });

        const prefix = message.guild.prefix || "!"; // Default Prefix (!)
        
        // 📌 Help Menu
        if (args[0] === "help") {
            const helpEmbed = new MessageEmbed()
                .setTitle("📌 Reaction Role Help")
                .setDescription("Set up reaction roles that users can claim by reacting to messages.")
                .addFields(
                    { name: "🆕 Create a new reaction role", value: `\`${prefix}reactionrole <emoji> @role\``, inline: false },
                    { name: "🔧 Add reaction role to an existing message", value: `\`${prefix}reactionrole <emoji> @role <message ID>\``, inline: false }
                )
                .setFooter("React to get the role!")
                .setColor("#3498db");

            return message.reply({ embeds: [helpEmbed] });
        }

        const [emoji, roleMention, messageId] = args;
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(roleMention);

        if (!emoji || !role) {
            const usageEmbed = new MessageEmbed()
                .setTitle("❌ Incorrect Usage")
                .setDescription(`**Usage:** \`${prefix}reactionrole <emoji> @role [message ID]\`\n\nFor more help, use \`${prefix}reactionrole help\`.`)
                .setColor("#ff0000");

            return message.reply({ embeds: [usageEmbed] }); // ✅ Fixed: Embed properly passed
        }

        let targetMessage;

        if (messageId) {
            try {
                targetMessage = await message.channel.messages.fetch(messageId);
            } catch {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("❌ Invalid Message ID")
                            .setDescription("Could not find a message with that ID. Make sure the message is in this channel.")
                            .setColor("#ff0000")
                    ]
                });
            }
        } else {
            const embed = new MessageEmbed()
                .setTitle("📌 Reaction Role")
                .setDescription(`**React with ${emoji} to get the <@&${role.id}> role!**\n\n🔹 Click on the reaction below to claim or remove the role.`)
                .setColor("#3498db")
                .setFooter("Reaction Roles System");

            targetMessage = await message.channel.send({ embeds: [embed] });
        }

        await targetMessage.react(emoji);

        // Store reaction-role pairs in memory
        if (!client.reactionRoles) client.reactionRoles = new Map();
        client.reactionRoles.set(targetMessage.id, { emoji, roleId: role.id });

        const successEmbed = new MessageEmbed()
            .setTitle("✅ Reaction Role Created")
            .setDescription(`A reaction role has been set up! Users can react to the message to receive the **${role.name}** role.`)
            .addField("📩 Message Link", `[Click here](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${targetMessage.id})`, false)
            .setColor("#2ecc71")
            .setFooter("Reaction Roles System");

        message.reply({ embeds: [successEmbed] });
    }
};
