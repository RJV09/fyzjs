module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        if (member.user.bot) {
            const isAntiUnverifiedBotEnabled = await client.db.get(`${member.guild.id}_antiunverifiedbot`);
            if (isAntiUnverifiedBotEnabled) {
                const isVerified = await checkBotVerification(member.user.id, member.guild);
                if (!isVerified) {
                    try {
                        await member.ban({ reason: 'Unverified bot detected' });
                        const channel = member.guild.systemChannel || member.guild.defaultChannel;
                        if (channel) {
                            channel.send(`A bot named ${member.user.tag} was banned for being unverified.`);
                        }
                    } catch (err) {
                        console.error('Failed to ban unverified bot:', err);
                    }
                }
            }
        }
    });

    async function checkBotVerification(botId, guild) {
        try {
            const auditLogs = await guild.fetchAuditLogs({
                limit: 5,
                type: 'BOT_ADD'
            });


            const botEntry = auditLogs.entries.find(entry => entry.target.id === botId);
            if (!botEntry) {
                return false; 
            }

            const botIsVerified = botEntry.extra && botEntry.extra.has('verified_flag');
            return botIsVerified;
        } catch (err) {
            console.error('Error fetching audit logs:', err);
            return false;
        }
    }
};
