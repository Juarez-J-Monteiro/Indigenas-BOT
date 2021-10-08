module.exports.run = async(client, msg, args, servidores) => {
    try {
        servidores[msg.guild.id].connection = await msg.member.voice.channel.join();
    } catch (err) {
        console.log('Erro ao entrar num canal de voz!')
    }
}