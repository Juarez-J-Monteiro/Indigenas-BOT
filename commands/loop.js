module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    if (servidores[msg.guild.id].loopM === true) {
        servidores[msg.guild.id].loopM = false
        msg.channel.send('Loop de música desativado!')
    }
    else if (servidores[msg.guild.id].fila.length > 0) {
        servidores[msg.guild.id].loopM = true
        msg.channel.send('Loop de música ativado!')
    }
    else {
        msg.channel.send('Minha fila está vazia!')
    }
}