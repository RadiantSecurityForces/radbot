const fs = require('fs').promises;
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_MESSAGE_REACTIONS"] });
const config = require('./commands/config.json');

client.commands = new Discord.Collection();

async function setupCommands() {
    const commandFiles = await fs.readdir('./commands');
    for (const file of commandFiles) {
        if (file.endsWith('.js')) {
            const command = require(`./commands/${file}`);
            client.commands.set(command.name, command);
        }
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    setupCommands();
});

client.on('guildMemberAdd', (member) => {
  if (member.guild.id === '1110594019442036817') {
    const channel = member.guild.channels.cache.get('1146080509999464509');
    const membername = member.user.tag;
    const welcomemessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setThumbnail(member.user.avatarURL())
      .setAuthor(membername, member.user.displayAvatarURL())
      .setTitle('Welcome')
      .setDescription('Welcome to the radiant security forces server!')
      .addFields({name: `Hey, ${membername}`, value: `Welcome to the R.S.F server!\nMake sure to checkout <#1142853656501309540> for chatting.\nFor seeing the github log see <#1143491212792316046>.\n\nIMPORTANT STUFF\nStay updated with the <#1142401608114774026> channel.\nSee what this is for server in <#1142852887781855323>.\nAnd the most importantst thing, please read <#1142856497613787156> for the rules.\nOh and have some fun :)`})
      .setFooter('Radient security forces')
    channel.send({ embeds: [welcomemessage] });
  }
});

client.on('guildCreate', guild => {
  const serverjoinmessage = new Discord.MessageEmbed()
    .setColor('0099ff')
    .setTitle(`Thank you for adding me to ${guild}`)
    .addFields({name: 'Thank you for adding me to this server!', value: `` })
})

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.startsWith(config.prefix)) {
      const args = message.content.slice(config.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const command = client.commands.get(commandName);

      if (!command) return;

      try {
          command.execute(message, args);
      } catch (error) {
          console.error(error);
          message.reply('There was an error while executing the command.');
      }
  }
});

client.login(config.token);
