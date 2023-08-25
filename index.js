const fs = require('fs').promises;
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
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
