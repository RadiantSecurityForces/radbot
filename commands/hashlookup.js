const Discord = require('discord.js');
const axios = require('axios');

// Function to perform hash lookup
async function performHashLookup(hash) {
    const apiKey = 'e79ff05974ff2b68fed7842cf0a4031f2fabd9102e6d027b01bf30614552f3ee';
    const url = `https://www.virustotal.com/api/v3/files/${hash}`;
    
    try {
        const response = await axios.get(url, {
            headers: {
                'x-apikey': apiKey,
            },
        });

        if (response.data.data.attributes.last_analysis_stats.malicious > 0) {
            const malicious = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('This hash is associated with a known malicous file.')

            return ({ embeds: [malicious] });
            // return 'This hash is associated with a known malicious file.';
        } else {
            const notmalicious = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('This hash is not associated with any known malicious files.')

            return ({ embeds: [notmalicious] });

            // return 'This hash is not associated with any known malicious files.';
        }
    } catch (error) {
        console.error('Error performing hash lookup:', error);
         const hasherror = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('An error occured while checking the hash.')

            return ({ embeds: [hasherror] });

        return 'An error occurred while checking the hash.';
    }
}

module.exports = {
    name: 'hashlookup',
    description: 'Perform hash lookup to check for known malicious files.',
    async execute(message, args) {
        const hash = args[0];
          if (!hash) {
            const nohash = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Please provide a hash to check.')

            return message.reply({ embeds: [nohash] });

            // return message.reply('Please provide a hash to check.');
        }

        const result = await performHashLookup(hash);
        message.channel.send(result);
    },
};
