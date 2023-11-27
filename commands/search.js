// commands/search.js
const fs = require('fs');
const Discord = require('discord.js');
const path = require('path');
const searchDirectory = path.join(__dirname, '..', 'victimData');

module.exports = {
  name: 'search',
  description: 'Search for a victim',
  async execute(message, args) {

    //create an embed for the message if you call the command
    const searchcalledmessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Send the search term in this channel')
    
    // send the message
    await  message.channel.send({ embeds: [searchcalledmessage] });

    // create a function what whill get the response message
    const filter = response => response.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, { time: 60000 });

    // when the search term is given
    collector.on('collect', collectedMessage => {

      // set the search term to lowercase symbols
      const keyword = collectedMessage.content.toLowerCase();

      try {
        // create a new variable called files where the matching search results will be saved
        const files = fs.readdirSync(searchDirectory).filter(file => file.toLowerCase().includes(keyword));

        // delete the fileextension so it's easyer to read
        const fileswithoutfileextension = files.map(file => path.parse(file).name);

        // if there are no matching search results
        if (fileswithoutfileextension.length === 0) {

          // create an embed
          const noresultsfoundembed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Search results')
            .addFields({ name: 'No results found.', value: '\u200b' })

          // send the embed
          message.channel.send({ embeds: [noresultsfoundembed] });
        } /*if there are matching search results*/ else {

          // create an embed
          const results = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Search results')
            .setDescription(`${fileswithoutfileextension.length} results found:\n${fileswithoutfileextension.join('\n')}`)
          // send the embed
          message.channel.send({ embeds: [results] })
        }
        // if there is an error it will log it into the console
      } catch (error) {
        console.error(error);
      }
      // stop the collector with collecting messages
      collector.stop();
    });
  }
};

