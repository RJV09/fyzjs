const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return;

        const blockedWordsPath = path.join(__dirname, '../blockedWords.json');

        if (!fs.existsSync(blockedWordsPath)) {
            const initialData = {};
            try {
                fs.writeFileSync(blockedWordsPath, JSON.stringify(initialData, null, 2));
            } catch (err) {
                console.error('Error creating the blocked words file:', err);
                return;
            }
        }

        let blockedWordsData;
        try {
            blockedWordsData = JSON.parse(fs.readFileSync(blockedWordsPath, 'utf8'));
        } catch (err) {
            console.error('Error reading the blocked words file:', err);
            return;
        }

        if (blockedWordsData[message.guild.id]) {
            const blockedWords = blockedWordsData[message.guild.id];

            for (const word of blockedWords) {
                if (message.content.toLowerCase().includes(word)) {
                    await message.delete();

                    const notificationMessage = await message.channel.send(`<a:Error:1322518020006088767> Your message was deleted because it contains one of the blocked word`);

                    setTimeout(async () => {
                        await notificationMessage.delete();  
                    }, 5000); 

                    return;
                }
            }
        }
    });
};