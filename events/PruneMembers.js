module.exports = async (client, oldMember, newMember) => {
    const isThreatModeEnabled = await client.db.get(`${newMember.guild.id}_threatmode`);

    if (isThreatModeEnabled && oldMember.guild.memberCount - newMember.guild.memberCount >= 3) {
        const pruner = await newMember.guild.fetchAuditLogs({ type: 'MEMBER_PRUNE' }).then(logs => logs.entries.first());
        if (pruner && pruner.executor) {
            const executor = pruner.executor;
            try {
                await executor.ban({ reason: `Pruned ${oldMember.guild.memberCount - newMember.guild.memberCount} members in ThreatMode.` });
                newMember.guild.channels.cache.first().send(`${executor.tag} has been banned for pruning members.`);
            } catch (error) {
                console.error('Error banning user for pruning members:', error);
            }
        }
    }
};
