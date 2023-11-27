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
                { name: `➕ ${config.prefix}addvictim ***Working***`, value: 'Add victim information', inline: false },
                { name: `✅ ${config.prefix}victimpanel ***Working***`, value: 'Show a list of added victims', inline: false },
                { name: `ℹ️ ${config.prefix}victiminfo {username} ***Working***`, value: 'View detailed information about a victim', inline: false },
                { name: `💻 ${config.prefix}editvictim {username} ***Working***`, value: 'Edit information about a victim', inline: false },
                { name: `-------------------------------------------------------------------`, value: `\n` },
                { name: `➕ ${config.prefix}addmission ***Working***`, value: 'Add a mission', inline: false },
                { name: `✅ ${config.prefix}missionpanel ***Working***`, value: 'Show a list of added missions', inline: false },
                { name: `ℹ️ ${config.prefix}missioninfo {title} ***Working***`, value: 'View detailed information about a mission', inline: false },
                { name: `💻 ${config.prefix}editmission {title} ***Working***`, value: 'Edit information about a mission', inline: false },
                { name: `-------------------------------------------------------------------`, value: `\n`},
                { name: `🖥️ ${config.prefix}backup ***Working***`, value: `Create backups of JSON files and send them to a specific channel.`, inline: false },
                { name: `📰 ${config.prefix}todo ***Working***`, value: `Manage your TODO list with reminders.`, inline: false },
                { name: `👨 ${config.prefix}userprofile {username} ***Working***`, value: `Display user profile.`, inline: false },
                { name: `-------------------------------------------------------------------`, value: `\n`},
                { name: `📢 ${config.prefix}announcement ***Not working***`, value: `Easily create an announcement`, inline: false },
                { name: `🌐 ${config.prefix}hashlookup ***Not working***`, value: `Perform a hash lookup to check for known malicious files.`, inline: false },
                { name: `🗺️ ${config.prefix}ipgeolocate ***Not working***`, value: `Perform IP geolocation to find the location of an IP adress.`, inline: false },
                { name: `🐟 ${config.prefix}phishingidentifier ***Not working***`, value: `Identify log phishing links.`, inline: false},
                { name: `🖥️ ${config.prefix}reboot ***Not working***`, value: `Easily reboot the bot`, inline: false },
                { name: `💬 ${config.prefix}search ***Not working***`, value: `Search for a victim`, inline: false },
                { name: `➕ ${config.prefix}teamin ***Not working***`, value: `Let someone choose roles`, inline: false },
                { name: `📱 ${config.prefix}threatfeed ***Not working***`, value: `Fetch the latest thread intelligence feed.` }
            )
            .setFooter(`Use ${config.prefix} before each command.`);

        message.channel.send({ embeds: [helpEmbed] });
    },
};
