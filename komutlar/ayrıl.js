const { RichEmbed } = require("discord.js"); 

module.exports.run = async (client, message, args) => {
  const keremrk = new RichEmbed()
    .setDescription("İstenmediğim Yerde Durmam! 😐")
    .setTitle(`Elveda 🤐`)
    .setTimestamp()
    .setThumbanil(client.user.avatarURL)
    .setColor("YELLOW")
    .setFooter(`${message.guild.name}`);
  message.channel.send(keremrk);
  message.guild.leave();
};

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["leave"],
  permLevel: 0
};

module.exports.help = {
  name: "ayrıl",
  description: "",
  usage: ""
};
