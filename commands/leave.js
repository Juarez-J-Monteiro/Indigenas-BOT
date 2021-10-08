module.exports.run = async(client, msg, args, servidores) => {
    try {
        msg.member.voice.channel.leave();
        servidores[msg.guild.id].connection = null
        servidores[msg.guild.id].dispatcher = null
        servidores[msg.guild.id].loopIn === false
        servidores[msg.guild.id].estouTocando = false;
        servidores[msg.guild.id].fila = []
        servidores[msg.guild.id].requisitado = []
        servidores[msg.guild.id].titulo = []
        servidores[msg.guild.id].loop = []
        servidores[msg.guild.id].lotitulo = []
        servidores[msg.guild.id].lorequisitado = []
    } catch (err) {
        console.log('Erro ao sair de um canal de voz')
    }
}