const { RichEmbed } = require("discord.js"); 
const config = require("../ayarlar.json");

module.exports.run = async (client, message, args) => {
  let keremb = new RichEmbed()
    .setColor("BLUE")
    .setThumbnail(client.user.avatarURL)
    .setTimestamp()

    .setTitle("Bot Bilgilendirme")
    .addField("• Prefix", `${config.prefix}`, true)
    .addField("• Toplam Sunucu", client.guilds.size, true)
    .addField("• Toplam Kullanıcı", client.users.size, true)
  message.channel.send(keremb);
};

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["info"],
  permLevel: 0
};

module.exports.help = {
  name: "bilgi",
  description: "",
  usage: ""
};

