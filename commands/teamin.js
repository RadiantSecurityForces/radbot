const Discord = require('discord.js');

module.exports = {
  name: 'teamin',
  description: 'Let someone choose roles',
  async execute(message, args) {
    const askrole = new Discord.MessageEmbed()
      .setColor('0099ff')
      .setTitle('Welcome to RSF. You can now choose a role.')
      .setDescription('You can choose one of the following roles by reacting with the corresponding emoji:\n' +
        '<@&1143187176037822525>\n' +
        '<@&1171085847999815760>\n' +
        '<@&1171085810632773632>\n' +
        '<@&1171085714297983097>\n' +
        '<@&1171085767825690716>\n' +
        '<@&1171085987716280432>\n' +
        '<@&1171085946939261018>\n' +
        '<@&1171086439396687884>\n' +
        '<@&1171085904631320678>\n' +
        '<@&1143186607697039421>'
      );

    const msg = await message.channel.send({ embeds: [askrole] });

    msg.react('👾');
    msg.react('🎨');
    msg.react('🤖');
    msg.react('🌐');
    msg.react('⚙️');
    msg.react('📱');
    msg.react('🖥️');
    msg.react('🧠');
    msg.react('📁');
    msg.react('❗');

    const filter = (reaction, user) => {
      return ['👾', '🎨', '🤖', '🌐', '⚙️', '📱', '🖥️', '🧠', '📁', '❗'].includes(reaction.emoji.name) && user.id === message.author.id;
    };

    const collector = msg.createReactionCollector({ filter, time: 60000 });

    collector.on('collect', async (reaction, user) => {
      console.log('Collected');
      console.log(reaction.emoji.name);
      console.log(user.username);

      if (reaction.emoji.name === '👾' && user.id === message.author.id) {
        console.log('A user reacted');
        const hackerrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Cyberattacker Role')
          .setDescription('As a cyberattacker, you are mainly associated with network attacks. You will protect the victim, create exploiting tools, and maintain ethical conduct in your actions.');
        msg.edit({ embeds: [hackerrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '🎨' && user.id === message.author.id) {
        console.log('A user reacted');
        const artistrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Artist Role')
          .setDescription(`Designer's job is to create designs for our products which includes creating logos, images that can be used in our UI and more.`);
        msg.edit({ embeds: [artistrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '🤖' && user.id === message.author.id)  {
        console.log('A user reacted');
        const botdevrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Bot Developer Role')
          .setDescription(`Discord Bot developer. Able to make, configure and deploy discord bots either with d.js or d.py.`);
        msg.edit({ embeds: [botdevrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '🌐' && user.id === message.author.id) {
        console.log('A user reacted');
        const webdevrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Web Developer Role')
          .setDescription(`This includes 3 things, HTML+CSS+JS. As a web developer you have knowledge in the 3 programming languages for web development + is able to create websites and manage them.`);
        msg.edit({ embeds: [webdevrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '⚙️' && user.id === message.author.id) {
        console.log('A user reacted');
        const osdevrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('OS Developer Role')
          .setDescription(`An operating system developer which can create an OS and make sure its compatiable enough.`);
        msg.edit({ embeds: [osdevrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '📱' && user.id === message.author.id) {
        console.log('A user reacted');
        const mobiledevrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('APK Developer Role')
          .setDescription(`A developer that can create and manage applications which works for Android and uses APK.`);
        msg.edit({ embeds: [mobiledevrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '🖥️' && user.id === message.author.id) {
        console.log('A user reacted');
        const windevrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Windows Developer Role')
          .setDescription(`A developer that can create and manage applications which works for Windows and uses exe/msi.\n*Note: You may use MS .NET  if you want.*`);
        msg.edit({ embeds: [windevrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '🧠' && user.id === message.author.id) {
        console.log('A user reacted');
        const brainrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('AI Developer Role')
          .setDescription(`Able to create and develop Artifical Intelligence bots`);
        msg.edit({ embeds: [brainrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '📁' && user.id === message.author.id) {
        console.log('A user reacted');
        const filedevrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Data Engineer Role')
          .setDescription(`No description ready yet`)
        msg.edit({ embeds: [filedevrole] });
        msg.reactions.removeAll();
        collector.stop();
      }

      if (reaction.emoji.name === '❗' && user.id === message.author.id) {
        console.log('A user reacted');
        const bughunterrole = new Discord.MessageEmbed()
          .setColor('0099ff')
          .setTitle('Bug Hunter Role')
          .setDescription(`No description ready yet`)
        msg.edit({ embeds: [bughunterrole] });
        msg.reactions.removeAll();
        collector.stop();
      }
    });

    collector.on('end', (collected, reason) => {
      console.log('Collector ended because:\n' + reason);
    });
  },
};
