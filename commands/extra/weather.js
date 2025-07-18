const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'weather',
    aliases: ['forecast'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const location = args.join(' ') || 'Unknown Location';

        const weatherConditions = [
            'Clear sky',
            'Partly cloudy',
            'Overcast',
            'Light rain',
            'Heavy rain',
            'Thunderstorms',
            'Snow',
            'Foggy'
        ];

        const temperatures = [
            { condition: 'Clear sky', temp: 25 },
            { condition: 'Partly cloudy', temp: 20 },
            { condition: 'Overcast', temp: 18 },
            { condition: 'Light rain', temp: 15 },
            { condition: 'Heavy rain', temp: 12 },
            { condition: 'Thunderstorms', temp: 10 },
            { condition: 'Snow', temp: -5 },
            { condition: 'Foggy', temp: 8 }
        ];

        const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        const temperatureData = temperatures.find((data) => data.condition === randomCondition);

        const humidity = Math.floor(Math.random() * (100 - 30) + 30); 
        const windSpeed = (Math.random() * 10).toFixed(1); 
        const pressure = Math.floor(Math.random() * (1020 - 980) + 980); 

        const weatherEmbed = new MessageEmbed()
            .setColor(client.color)
            .setTitle(`Weather in ${location}`)
            .setDescription(`Current weather in ${location} is simulated.`)
            .addFields(
                {
                    name: 'Temperature',
                    value: `${temperatureData.temp}°C`,
                    inline: true,
                },
                {
                    name: 'Weather Condition',
                    value: randomCondition,
                    inline: true,
                },
                {
                    name: 'Humidity',
                    value: `${humidity}%`,
                    inline: true,
                },
                {
                    name: 'Wind Speed',
                    value: `${windSpeed} m/s`,
                    inline: true,
                },
                {
                    name: 'Pressure',
                    value: `${pressure} hPa`,
                    inline: true,
                }
            )
            .setThumbnail('https://openweathermap.org/img/wn/01d.png') 
            .setFooter({
                text: `Requested by ${message.author.tag}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        await message.channel.send({ embeds: [weatherEmbed] });
    },
};
