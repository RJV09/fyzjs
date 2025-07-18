module.exports = {
    name: 'google',
    aliases: ['search'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const query = args.join(' ');
        if (!query) {
            return message.channel.send('Please provide a search query. Example: `!google Discord bot`');
        }

        const searchLink = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        message.channel.send(`Here are the Google search results for: [${query}](${searchLink})`);
    },
};
