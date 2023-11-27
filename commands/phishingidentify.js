const fs = require('fs');
const Discord = require('discord.js');

const phishingLinkListPath = './list.txt'; // oupdate with the correct path to your list.txt
const logsChannelName = 'fishinglog'; // update with the correct channel name for logs
const mutedRoleID = '1159182441861353552'; // Make a Muted Role with the suiting permission and replace with the muted role ID (i'll give the list.txt )

const phishingLinks = fs.readFileSync(phishingLinkListPath, 'utf-8').split('\n');
const logsChannelCache = {};

module.exports = {
    name: 'phishingidentifier',
    description: 'Identify and log phishing links.',
    async execute(message) {
        const messageContent = message.content;
        
        // check if the message contains a URL
        const urlMatch = messageContent.match(/(https?|ftp):\/\/[^\s/$.?#].[^\s]*/gi);

        if (urlMatch) {
            const url = urlMatch[0];

            // extract domain from the URL
            const domain = url.match(/(https?|ftp):\/\/([^\s/$.?#].[^\s]*)/i)[2];

            // check if the domain is in the phishing links list
            if (phishingLinks.includes(domain)) {
                // log the phishing attempt
                const logsChannel = getLogsChannel(message.guild);
                if (logsChannel) {
                    logsChannel.send(`Phishing link detected from ${message.author}:\n${url}`);
                }

                // mute the user
                const member = message.guild.members.cache.get(message.author.id);
                if (member) {
                    const mutedRole = message.guild.roles.cache.get(mutedRoleID);
                    if (mutedRole) {
                        member.roles.add(mutedRole);
                    }
                }

                // delete the phishing link message
                message.delete();
            }
        }
    },
};

// Function to get or cache the logs channel
function getLogsChannel(guild) {
    if (logsChannelCache[guild.id]) {
        return logsChannelCache[guild.id];
    }

    const logsChannel = guild.channels.cache.find((channel) => channel.name === logsChannelName);

    if (logsChannel) {
        logsChannelCache[guild.id] = logsChannel;
        return logsChannel;
    }

    return null;
}
