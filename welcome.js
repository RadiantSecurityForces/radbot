const Discord = require('discord.js');
const serverID = '1110594019442036817';
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });

module.exports = (client) => {
    client.on('guildMemberAdd', (member) => {
        console.log(member);
        const guildId = '1110594019442036817';
        const channelId = '1146080509999464509';
        
        if (member.guild.id === guildId) {
            const welcomeChannel = member.guild.channels.cache.get(channelId);
            if (welcomeChannel) {
              welcomeChannel.send(`Welcome to the server, ${member}`);
              const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Welcome to the server, ' + member)
                
            }
        }
    });
};
