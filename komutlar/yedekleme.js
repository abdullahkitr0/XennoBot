const { RichEmbed, Client, Util, Message } = require("discord.js");
const fs = require("fs");
const hastebins = require("hastebin-gen");
const config = require("../ayarlar.json");
var backups = JSON.parse(fs.readFileSync("./Data/backups.json", "utf8"));

module.exports.run = async (client, message, args, member) => {
  let info = client.emojis.get("ℹ") || "ℹ️";
  let waiting = client.emojis.get("⌛") || "⌛"; 
  let green = client.emojis.get("✅") || "✅"; 
  let error = client.emojis.get("❌") || "❌"; 
  let warning = client.emojis.get("⚠️") || "⚠️"; 

  let keremrk1 = new RichEmbed()
    .setTitle(`${error} Hata!`)
    .setDescription(`**Komutları Sadece Sunucularda Kullana Bilirsin!**`)
    .setColor("RED");
  if (message.channel.type === "dm") return message.channel.send(keremrk1);
  if (args[0] === "oluştur") {
    await message.guild.roles
      .filter(
        r => r.name !== message.guild.member(client.user.id).highestRole.name
      )
      .forEach(r => {
        if (
          r.comparePositionTo(
            message.guild.member(client.user.id).highestRole
          ) > 0
        ) {
          let keremrk2 = new RichEmbed()
            .setTitle(`⚠️ ${warning}  Uyarı!`)
            .setDescription(
              `**Sunucuyu Yedeklemek İçin Botun Rölü Sunucuda En Üstte Olmalıdır!**`
            )
            .setColor("RED")
            .setThumbnail(message.author.avatarURL)
            .setFooter(`Kullanan:  ${message.author.tag}`);
          message.channel.send(keremrk2);
        }
      });

    let keremrk3 = new RichEmbed()
      .setTitle(`${green} Oluşturuluyor!`)
      .setColor("GREEN")
      .setDescription("**🔖 Yedek Oluşturuluyor... Lütfen Bekleyiniz!**");
    message.channel.send(keremrk3).then(m => {
      let id = makeid(16);

      const channels = message.guild.channels
        .sort(function(a, b) {
          return a.position - b.position;
        })
        .array()
        .map(c => {
          const channel = {
            type: c.type,
            name: c.name,
            postion: c.calculatedPosition
          };
          if (c.parent) channel.parent = c.parent.name;
          return channel;
        });

      const roles = message.guild.roles
        .filter(r => r.name !== "@everyone")
        .sort(function(a, b) {
          return a.position - b.position;
        })
        .array()
        .map(r => {
          const role = {
            name: r.name,
            color: r.color,
            hoist: r.hoist,
            permissions: r.permissions,
            mentionable: r.mentionable,
            position: r.position
          };
          return role;
        });

      if (!backups[message.author.id]) backups[message.author.id] = {};
      backups[message.author.id][id] = {
        icon: message.guild.iconURL,
        name: message.guild.name,
        owner: message.guild.ownerID,
        members: message.guild.memberCount,
        createdAt: message.guild.createdAt,
        roles,
        channels
      };

      save();
      let keremrk4 = new RichEmbed()
        .setTitle(`${info}  Bilgilendirme`)
        .setDescription(
          `**__${message.guild.name}__ İsimli Sunucu'nun Yedeği Oluşturuldu!\nID: \`${id}\`**`
        )
        .addField(
          "Kullanma Şekli",
          `\`\`\`!yedek yükle ${id}\`\`\`
\`\`\`!yedek bilgi ${id}\`\`\``
        )
        .setColor("BLUE");

      message.author.send(keremrk4);

      let keremrk5 = new RichEmbed()
        .setTitle(`${green}  İşlem Başarılı!`)
        .setDescription(
          `**__${message.guild.name}__ İsimli Sunucu'nun Yedeği Oluşturuldu!\nID: \`${id}\`**`
        )
        .addField(
          "Kullanma Şekli",
          `\`\`\`!yedek yükle ${id}\`\`\`
\`\`\`!yedek bilgi ${id}\`\`\``
        )
        .setColor("GREEN");

      m.edit(keremrk5);
    });
  }

  if (args[0] === "sil") {
    let code = args[1];
    let keremrk6 = new RichEmbed()
      .setTitle(`${error}  Hata!`)
      .setDescription(
        `**Silinecek Olan Sunucu Yedekleme ID'sini Yazmayı Unuttun!**`
      )
      .setColor("RED")
      .setThumbnail(message.author.avatarURL)
      .setFooter(`Kullanan:  ${message.author.tag}`);
    if (!code) return message.channel.send(keremrk6);

    let keremrk7 = new RichEmbed()
      .setTitle(`${error}  Hata!`)
      .setDescription(
        `**Bu ID'ye Sahip Sunucu Yedeği Bulunamadı!\nGirilen ID: __${code}__**`
      )
      .setColor("RED")
      .setFooter(`Kullanan:  ${message.author.tag}`)
      .setThumbnail(message.author.avatarURL);
    if (!backups[message.author.id][code]) return message.channel.send(keremrk7);

    delete backups[message.author.id][code];
    save();

    let keremrk8 = new RichEmbed()
      .setTitle(`${green}  İşlem Başarılı!`)
      .setDescription(`**Başarıyla Belirtilen Sunucu Yedeği Silindi!**`)
      .setColor("GREEN")
      .setFooter(`Kullanan:  ${message.author.tag}`)
      .setThumbnail(message.author.avatarURL);
    message.channel.send(keremrk8);
  }

  if (args[0] === "yükle") {
    let error = client.emojis.get("❌") || "❌";
    let code = args[1];
    let keremrk9 = new RichEmbed()
      .setTitle(`${error}  Hata!`)
      .setDescription(
        `**Yedeğini Yüklemek İstediğin Yedek ID'sini Yazmayı Unuttun!**`
      )
      .setFooter(`Kullanan:  ${message.author.tag}`)
      .setThumbnail(message.author.avatarURL);
    if (!code) return message.channel.send(keremrk9);
    let keremrk10 = new RichEmbed()
      .setTitle(`${error}  Hata!`)
      .setDescription(
        `**Bu ID'ye Sahip Sunucu Yedeği Bulunamadı!\nGirilen iD: __${code}__**`
      )
      .setColor("RED")
      .setFooter(`Kullanan:  ${message.author.tag}`)
      .setThumbnail(message.author.avatarURL);
    if (!backups[message.author.id][code]) return message.channel.send(keremrk10);

    message.guild.channels.forEach(channel => {
      channel.delete("Sunucu Yedeği Yükleniyor!");
    });

    message.guild.roles
      .filter(role => role.members.every(member => !member.user.bot))
      .forEach(role => {
        role.delete("Sunucu Yedeği Yükleniyor!");
      });
    await backups[message.author.id][code].roles.forEach(async function(role) {
      message.guild
        .createRole({
          name: role.name,
          color: role.color,
          permissions: role.permissions,
          hoist: role.hoist,
          mentionable: role.mentionable,
          position: role.position
        })
        .then(role => {
          role.setPosition(role.position);
        });
    });

    await backups[message.author.id][code].channels
      .filter(c => c.type === "category")
      .forEach(async function(ch) {
        message.guild.createChannel(ch.name, ch.type, ch.permissionOverwrites);
      });

    await backups[message.author.id][code].channels
      .filter(c => c.type !== "category")
      .forEach(async function(ch) {
        message.guild
          .createChannel(ch.name, ch.type, ch.permissionOverwrites)
          .then(c => {
            const parent = message.guild.channels
              .filter(c => c.type === "category")
              .find(c => c.name === ch.parent);
            ch.parent ? c.setParent(parent) : "";
          });
      });
    message.guild.setName(backups[message.author.id][code].name);
    message.guild.setIcon(backups[message.author.id][code].icon);
  }

  if (args[0] === "bilgi") {
    let id = args[1];
    let keremrk11 = new RichEmbed()
      .setTitle(`${error}  Hata!`)
      .setDescription(
        `**Bilgi Verilecek Olan Sunucu Yedeğine Ait Olan ID'yi Yazmayı Unuttun!**`
      )
      .setColor("RED")
      .setFooter(`Kullanan:  ${message.author.tag}`)
      .setThumbnail(message.author.avatarURL);
    if (!id) return message.channel.send(keremrk11);

    let keremrk12 = new RichEmbed()
      .setTitle(`${error}  Hata!`)
      .setDescription(
        `**Bu ID'ye Ait Sunucu Yedeği Bulunamadı!\nGirilen ID: __${id}__**`
      )
      .setColor("RED")
      .setFooter(`Kullanan: ${message.author.tag}`)
      .setThumbnail(message.author.avatarURL);
    if (!backups[message.author.id][id]) return message.channel.send(keremrk12);

    try {
      let keremrk13 = new RichEmbed()
        .setTitle(backups[message.author.id][id].name)
        .setThumbnail(backups[message.author.id][id].icon)
        .addField(
          "• Yedeği Oluşturan",
          `<@${backups[message.author.id][id].owner}>`,
          true
        )
        .addField(
          "• Sunucudaki Üyeler",
          backups[message.author.id][id].members,
          true
        )
        .addField(
          "• Oluşturulma Tarihi",
          backups[message.author.id][id].createdAt
        )
        .addField(
          "• Sunucudaki Kanallar",
          `\`\`\`${backups[message.author.id][id].channels
            .map(channel => channel.name)
            .join("\n")}\`\`\``,
          true
        )
        .addField(
          "• Sunucudaki Roller",
          `\`\`\`${backups[message.author.id][id].roles
            .map(role => role.name)
            .join("\n")}\`\`\``,
          true
        );
      message.channel.send(keremrk13);
    } catch (e) {
      hastebins(
        backups[message.author.id][id].channels
          .map(channel => channel.name)
          .join("\n"),
        "txt"
      ).then(ch => {
        hastebins(
          backups[message.author.id][id].roles
            .map(role => role.name)
            .join("\n"),
          "txt"
        ).then(ro => {
          let keremrk14 = new RichEmbed()
            .setTitle(backups[message.author.id][id].name)
            .setThumbnail(backups[message.author.id][id].icon)
            .addField(
              "• Yedeği Oluşturan",
              `<@${backups[message.author.id][id].owner}>`,
              true
            )
            .addField(
              "• Sunucudaki Üyeler",
              backups[message.author.id][id].members,
              true
            )
            .addField(
              "• Oluşturulma Tarihi",
              backups[message.author.id][id].createdAt
            )
            .addField("• Sunucudaki Kanallar", ch, true)
            .addField("• Sunucudaki Roller", ro, true);
          message.channel.send(keremrk14);
        });
      });
    }
  }

  if (args[0] === "temizle") {
    let keremrk15 = new RichEmbed()
      .setTitle(`${warning}  UYARI!`)
      .setDescription(
        `**Tüm Sunucu Yedeklerini Silmek İstediğinden Eminmisin?**`
      )
      .setColor("RED");
    message.channel.sendEmbed(keremrk15).then(msg => {
      msg.react("✅").then(() => msg.react("❌"));

      let yesFilter = (reaction, user) =>
        reaction.emoji.name === "✅" && user.id === message.author.id;
      let noFilter = (reaction, user) =>
        reaction.emoji.name === "❌" && user.id === message.author.id;

      let yes = msg.createReactionCollector(yesFilter, { time: 0 });
      let no = msg.createReactionCollector(noFilter, { time: 0 });

      yes.on("collect", r => {
        delete backups[message.author.id];

        let keremrk16 = new RichEmbed()
          .setTitle(`${green}  İşlem Başarılı!`)
          .setDescription(`**Tüm Sunucu Yedeklerin Silindi!**`)
          .setColor("GREEN")
          .setThumbnail(message.author.avatarURL)
          .setFooter(`Kullanan: ${message.author.tag}`);
        message.channel.send(keremrk16);
      });

      no.on("collect", r => {
        msg.delete();
      });
    });
  }

  if (!args[0]) {
    const keremrk_yardım = new RichEmbed()
      .setTitle(`${info}  Sunucunu Yedekle ve Güvende Tut!`)
      .setDescription(
        `**__YEDEKLEME MENÜSÜ__**\n \n**• \`${config.prefix}yedek oluştur\`      __Sunucuyu Yedekler!__\n• \`${config.prefix}yedek yükle\`        __Sunucuya Yedek Yükler!__\n• \`${config.prefix}yedek sil\`          __Belirtilen Yedeği Siler!__\n• \`${config.prefix}yedek bilgi\`        __Yedek Bilgisi Verir!__\n• \`${config.prefix}yedek liste\`        __Yedek Listeni Gösterir!__ (Yakında)\n• \`${config.prefix}yedek temizle\`      __Tüm Yedeklerinizi Siler!__**
              `
      )
      .setThumbnail(message.author.avatarURL)
      .setFooter(`Kullanan:  ${message.author.tag}`)
      .setColor("BLUE");
    message.channel.send(keremrk_yardım);
    return;
  }

  function makeid(length) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  function save() {
    fs.writeFile("./Data/backups.json", JSON.stringify(backups), err => {
      if (err) console.error(err);
    });
  }
};

module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["backup"],
  permLevel: 0
};

module.exports.help = {
  name: "yedek",
  description: "",
  usage: ""
};
