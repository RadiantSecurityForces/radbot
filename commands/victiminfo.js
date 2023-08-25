// commands/victiminfo.js
const fs = require('fs').promises;
const Discord = require('discord.js');

module.exports = {
    name: 'victiminfo',
    description: 'Show information about a specific victim.',
    async execute(message, args) {
        const victimName = args[0];

        if (!victimName) {
            return message.reply('Please provide a victim name.');
        }

        const victimFilePath = `${__dirname}/../victimData/${victimName}.json`;

        try {
            const victimData = await fs.readFile(victimFilePath, 'utf8');
            const victimInfo = JSON.parse(victimData);

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Victim Info: ${victimName}`)
                .addField('Username:', victimInfo.username)
                .addField('Contacts:', victimInfo.contacts)
                .addField('Socials:', victimInfo.socials)
                .addField('Notes:', victimInfo.notes);

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error fetching victim info:', error);
            message.reply(`An error occurred while fetching info for victim ${victimName}.`);
        }
    },
};
