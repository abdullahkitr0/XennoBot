const { RichEmbed } = require("discord.js");
module.exports.run = async (client, message, args) => {
  let info = client.emojis.get("ℹ") || "ℹ️";
  let keremping = new RichEmbed()
    .setTitle(`${info}  Ping Bilgilendirme`)
    .setDescription(`**Anlık Ping: __${Math.round(client.ping)}ms__**`)
    .setColor("BLUE")
    .setFooter(`${message.author.tag}`)
    .setTimestamp()
    .setThumbnail(client.user.avatarURL);
  message.channel.send(keremping);
};


module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

module.exports.help = {
  name: "ping",
  description: "",
  usage: ""
};
