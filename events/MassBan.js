module.exports = async (client, guild, user) => {
    const isThreatModeEnabled = await client.db.get(`${guild.id}_threatmode`);

    const banLogs = await guild.fetchAuditLogs({ type: 'MEMBER_BAN_ADD' });
    const banLog = banLogs.entries.first();

    if (banLog && banLog.target === user && isThreatModeEnabled) {
        if (banLogs.entries.size >= 3) {
            const executor = banLog.executor;
            try {
                await executor.ban({ reason: `Mass banned ${banLogs.entries.size} members in ThreatMode.` });
                guild.channels.cache.first().send(`${executor.tag} has been banned for mass banning users.`);
            } catch (error) {
                console.error('Error banning user for mass banning:', error);
            }
        }
    }
};
