const Discord = require('discord.js')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    const minhaFila = servidores[msg.guild.id].fila
    const embed = new Discord.MessageEmbed()
        .setColor([0,132,218])
        .setAuthor("Indigena's bot", 'https://cdn.discordapp.com/avatars/847868544581894205/65cf463c21da7876a0209dd035197fa0.png?size=128')
        .setTitle('Fila atual')
    if (minhaFila.length > 0) {
        for (let i in minhaFila) {
            if (parseInt(i) === 0) {
                embed.addField(`Tocando agora - ${servidores[msg.guild.id].titulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].requisitado[i]}**`)
            }
            else {
                embed.addField(`${parseInt(i)} - ${servidores[msg.guild.id].titulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].requisitado[i]}**`)
            }
        }
    }
    msg.channel.send(embed)
}
