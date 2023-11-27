// commands/announcement.js
const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"] });
const fs = require('fs');
const colorConvert = require('color-convert');

module.exports = {
  name: 'announcement',
  description: 'Easily create an announcement',
  async execute(message, args) {
    let embedcolor;
    const announcementcalledmessage = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Send the name of the channel you want to create an announcement in')
    await message.channel.send({ embeds: [announcementcalledmessage] });
    
    const filter = response => response.author.id === message.author.id;
    const collector = message.channel.createMessageCollector(filter, { time: 60000 });

    // when the search term is given
    collector.on('collect', async (collectedMessage) => {
      const channelName = collectedMessage.content;
      const channel1 = message.guild.channels.cache.find(chan => chan.name === channelName);

      if (channel1) {
        collector.stop();
        const confirmmessage = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`The channel where the announcement will be sent is ${channel1} answer with "yes" if that's okay, answer with "no" if you don't want to send an announcement`)
        await message.channel.send({ embeds: [confirmmessage] });
        
        const filter2 = response => response.author.id === message.author.id;
        const collector2 = message.channel.createMessageCollector(filter2, { time: 60000 });
        collector2.on('collect', async (collectedMessage2) => {
          const yesorno = collectedMessage2.content;

          if(yesorno === 'yes') {
            collector2.stop();
            const getcolor = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Set your color')
              .addFields({ name: `Now you can choose which color you want for your the embed.\n\nYou can choose between the following colors:`, value: 'Blue (The color of this embed)\nRed\nPurple\nGreen\nYellow\nOrange'})
            await message.channel.send({ embeds: [getcolor] }).then((msg) => {
              msg.react('🔵');
              msg.react('🔴');
              msg.react('🟣');
              msg.react('🟢');
              msg.react('🟡');
              msg.react('🟠');
            })

            const filter3 = (reaction, user) => {
              return reaction.emoji.name === '🔵', '🔴', '🟣', '🟢', '🟡', '🟠' && user.id === message.autor.id;
            };

            const collector3 = message.createReactionCollector(filter3, { time: 60000 });

            collector3.on('collect', async(collectedMessage3) => {
              console.log("reaction collected")
              const color = collectedMessage3.emoji.name;
              console.log(color);

              let defaultcolor
              if(color === '🔵') {
                embedcolor =  '#0099ff';
                defaultcolor = 'no';
              } else if(color === '🔴') {
                embedcolor = '#e74c3c';
                defaultcolor = 'no';
              } else if(color === '🟣') {
                embedcolor = '#8e44ad';
                defaultcolor = 'no';
              } else if(color === '🟢') {
                embedcolor = '#2ecc71';
                defaultcolor = 'no';
              } else if(color === '🟡') {
                embedcolor = '#f1c40f';
                defaultcolor = 'no';
              } else if(color === '🟠') {
                embedcolor = '#e67e22';
                defaultcolor = 'no';
                console.log("yes");
              } else {
                embedcolor = '#0099ff';
                defaultcolor = 'yes';
              }
              if(defaultcolor === 'yes') {
                const defaultcolorchosen = new Discord.MessageEmbed()
                  .setColor('0099ff')
                  .setTitle('You have chosen the chosen default color')
                  .addFields({ name: 'Which title do you want for the embed?', value: 'You can just send the title in this channel.' })
                await message.channel.send({ embeds: [defaultcolorchosen] });
                collector3.stop();
              } else {
                const customcolorchosen = new Discord.MessageEmbed()
                  .setColor(embedcolor)
                  .setTitle(`The color of your embed will be ${color}.`)
                  .addFields({ name: 'Which title do you want for the embed?', value: 'You can just send the title in this channel.'})
                await message.channel.send({ embeds: [customcolorchosen] });
                collector3.stop();
              }
              collector3.stop();
            });
              
            const filter4 = response => response.author.id === message.author.id;
            const collector4 = message.channel.createMessageCollector(filter4, { time: 60000} );

            collector4.on('collect', async (collectedMessage4) => {
              const title = collectedMessage4.content;
              console.log(title);

              const titleset = new Discord.MessageEmbed()
                .setColor(embedcolor)
                .setTitle(`The title of your announcement will be ${title}`)
                .addFields({ name: 'What have to be the text in the announcement?', value: 'Please send it in this channel in 5 minutes.'})
              message.channel.send({ embeds: [titleset] });
              collector4.stop();
            });

            const filter10 = response => response.author.id === message.author.id;
            const collector10 = message.channel.createMessageCollector(filter10, { time: 60000 });

            collector10.on('collect', async (collectedMessage10) => {
              const announcementtext = collectedMessage10.content;

              const announcementsentconfirmation = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Announcement sended')
                .setDescription('Your announcement is succesfully sended')
              //message.channel.send({ embeds: [announcementsentconfirmation] });
              //channel1.send(announcementtext);

              collector10.stop();
            });
          } else if(yesorno === 'no') {
            const cancelannouncement = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle('Your announcement was canceled')
            message.channel.send({ embeds: [cancelannouncement] });
          } else {
            const noyesorno = new Discord.MessageEmbed()
              .setColor('#0099ff')
              .setTitle(`You did'nt say "yes" or "no". Please say yes or no.`)
            message.channel.send({ embeds: [noyesorno] });
          }
          collector2.stop();
        });

      } else {
        const channelnotfoundmessage = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`${channelName} is not a channel. Please provide an existing channel name`)
        message.channel.send({embeds: [channelnotfoundmessage]});
      }
      collector.stop();
    });
  }
}
