const axios = require('axios');
const Discord = require('discord.js');

module.exports = {
    name: 'threatfeed',
    description: 'Fetch the latest threat intelligence feed.',
    async execute(message) {
        try {
            // Fetch data from a public threat intelligence feed (Example: MITRE's ATT&CK)
            const response = await axios.get('https://raw.githubusercontent.com/mitre/cti/main/enterprise-attack/enterprise-attack.json');

            if (response.status === 200) {
                // Parse the threat intelligence data (you may need to adapt this based on the feed format)
                const threatData = response.data;

                // Process and display the threat intelligence data
                const embed = new Discord.MessageEmbed()
                    .setColor('#FF5733')
                    .setTitle('Latest Threat Intelligence Feed')
                    .setDescription('Here is the latest threat intelligence feed:')
                    .addField('Data', 'json\n' + JSON.stringify(threatData, null, 2) + '');

                message.channel.send({ embeds: [embed] });
            } else {
                throw new Error('Failed to fetch threat intelligence data.');
            }
        } catch (error) {
            console.error('Error fetching threat intelligence:', error);
            message.reply('An error occurred while fetching the threat intelligence data.');
        }
    },
};
