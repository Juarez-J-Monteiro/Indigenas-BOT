const Discord = require('discord.js')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    const minhaFila = servidores[msg.guild.id].fila
    const minhaFilaloop = servidores[msg.guild.id].loop
    const embed = new Discord.MessageEmbed()
        .setColor([0,132,218])
        .setAuthor("Indigena's bot", 'https://cdn.discordapp.com/avatars/847868544581894205/65cf463c21da7876a0209dd035197fa0.png?size=128')
        .setTitle('Fila atual')
    if (minhaFilaloop.length > 0) {
        for (let i in minhaFilaloop) {
            if (parseInt(i) === 0) {
                embed.setTitle('Fila atual (Loop de fila ativado)')
                embed.addField(`Tocando agora - ${servidores[msg.guild.id].lotitulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].lorequisitado[i]}**`)
            }
            else {
                embed.addField(`${parseInt(i)} - ${servidores[msg.guild.id].lotitulo[i]}`, `Requisitado por: **${servidores[msg.guild.id].lorequisitado[i]}**`)
            }
        }
    }
    else if (minhaFila.length > 0) {
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
