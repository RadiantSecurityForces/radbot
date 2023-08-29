// commands/deletevictim
const fs = require('fs');
const Discord = require('discord.js');
const path = require('path');
const json = '.json'
const victimDirectory = path.join(__dirname, '..', 'victimData');

module.exports = {
  name: 'deletevictim',
  description: 'Delete a victim entry',
  async execute(message, args) {
    // create an embed
    const deletevictimcalledmessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Send the name of the victim you want to delete')
    // send the embed
    await message.channel.send({ embeds: [deletevictimcalledmessage] });

    // create a filter and a message collector to collect the response
    const filter = response => response.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, { time: 60000 });
    
    // if there is a response
    collector.on('collect', collectedMessage => {

    // create a few variables for storing the response
    const victimentrytodelete = collectedMessage.content;
    const victimentrytodeleteplusjson = victimentrytodelete + json;
    const files = fs.readdirSync(victimDirectory).filter(file => file.includes(victimentrytodeleteplusjson));

    // if there are no matching files
    if (files.length === 0) {
      // create an embed
      const nofilesfound = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('There is no victim called ' + victimentrytodelete)
      // send the embed
      message.channel.send({ embeds: [nofilesfound] });
    } /*if there is a matching file*/ else {
        // delete the file
        fs.unlink(path.join(__dirname, '..', 'victimData', victimentrytodeleteplusjson), (err) => {
          // if there is an error
          if (err) {
            // create an embed
            const err = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('There was an error while deleting the victim called ' + victimentrytodelete)
            // send the embed
            message.channel.send({ embeds: [err] });
          } /*if there is no error*/ else {
            // create an embed
            const succes = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Succesfully deleted the victim ' + victimentrytodelete)
            // send the embed
            message.channel.send({ embeds: [succes] });
          }
        });
      }
    //stop wit collecting messages
    collector.stop();
    });
  }
};
