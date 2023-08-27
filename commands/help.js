// commands/help.js
const Discord = require('discord.js');
const config = require('./config.json'); // Adjust the path if needed

module.exports = {
    name: 'help',
    description: 'Show a help message with command information.',
    execute(message, args) {
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Command List')
            .setDescription(`Here are the available commands:`)
            .setThumbnail('https://i.gifer.com/embedded/download/IPql.gif') //  thumbnail image
            .addFields(
                { name: `${config.prefix}addvictim`, value: 'Add victim information', inline: false },
                { name: `${config.prefix}victimpanel`, value: 'Show a list of added victims', inline: false },
                { name: `${config.prefix}victiminfo {username}`, value: 'View detailed information about a victim', inline: false },
                { name: `${config.prefix}editvictim {username}`, value: 'Edit information about a victim', inline: false },
                { name: `${config.prefix}addmission`, value: 'Add a mission', inline: false },
                { name: `${config.prefix}missionpanel`, value: 'Show a list of added missions', inline: false },
                { name: `${config.prefix}missioninfo {title}`, value: 'View detailed information about a mission', inline: false },
                { name: `${config.prefix}editmission {title}`, value: 'Edit information about a mission', inline: false }
            )
            .setFooter(`Use ${config.prefix} before each command.`);

        message.channel.send({ embeds: [helpEmbed] });
    },
};
