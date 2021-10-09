const ytdl = require('ytdl-core')

module.exports.run = async(client, msg, args, servidores, prefixo, youtube, requerente, configs) => {
    const tocaLoop = (msg) => {
        if (servidores[msg.guild.id].disp === true) { //verifica se está tocando uma música
            var tocando = servidores[msg.guild.id].fila[0]

            // toca música
            servidores[msg.guild.id].estouTocando = true
            servidores[msg.guild.id].dispatcher = servidores[msg.guild.id].connection.play(ytdl(tocando, configs.YTDL))

            servidores[msg.guild.id].dispatcher.on('finish', () => { // Evento de quando termina a música
                servidores[msg.guild.id].fila.shift()
                servidores[msg.guild.id].titulo.shift()
                servidores[msg.guild.id].requisitado.shift()
                servidores[msg.guild.id].estouTocando = true
                servidores[msg.guild.id].dispatcher = null
                if (servidores[msg.guild.id].fila.length > 0) { //se a fila for maior que 0 ele toca a próxima
                    tocaLoop(msg)                               //música.
                }
                else { //repoem as música para reiniciar o fila
                    for (let i in servidores[msg.guild.id].loop) {
                        servidores[msg.guild.id].fila.push(servidores[msg.guild.id].loop[i])
                    }
                    for (let i in servidores[msg.guild.id].lorequisitado) {
                        servidores[msg.guild.id].requisitado.push(servidores[msg.guild.id].lorequisitado[i])
                    }
                    for (let i in servidores[msg.guild.id].lotitulo) {
                        servidores[msg.guild.id].titulo.push(servidores[msg.guild.id].lotitulo[i])
                    }
                    servidores[msg.guild.id].disp = true
                    tocaLoop(msg)
                }
            })
        }
        else { //O else faz com que a música n seja interrompida quando o loop é solicitado.
            servidores[msg.guild.id].dispatcher.on('finish', () => {
                var tocando = servidores[msg.guild.id].fila[0]

                //toca a música
                servidores[msg.guild.id].estouTocando = true
                servidores[msg.guild.id].dispatcher = servidores[msg.guild.id].connection.play(ytdl(tocando, configs.YTDL))

                servidores[msg.guild.id].dispatcher.on('finish', () => { 
                    servidores[msg.guild.id].fila.shift()
                    servidores[msg.guild.id].titulo.shift()
                    servidores[msg.guild.id].requisitado.shift()
                    servidores[msg.guild.id].estouTocando = true
                    servidores[msg.guild.id].dispatcher = null
                    if (servidores[msg.guild.id].fila.length > 0) {
                        tocaLoop(msg)
                    }
                    else { //repoem as música para reiniciar o fila
                        for (let i in servidores[msg.guild.id].loop) {
                            servidores[msg.guild.id].fila.push(servidores[msg.guild.id].loop[i])
                        }
                        for (let i in servidores[msg.guild.id].lorequisitado) {
                            servidores[msg.guild.id].requisitado.push(servidores[msg.guild.id].lorequisitado[i])
                        }
                        for (let i in servidores[msg.guild.id].lotitulo) {
                            servidores[msg.guild.id].titulo.push(servidores[msg.guild.id].lotitulo[i])
                        }
                        servidores[msg.guild.id].disp = true
                        tocaLoop(msg)
                    }
                })
            })
        }

    }
    if (servidores[msg.guild.id].estouTocando === false) {
        msg.channel.send('Minha fila está vazia!')
    }
    else if (servidores[msg.guild.id].loopIn === true) {
        msg.channel.send('Loop de fila desativado!')
        servidores[msg.guild.id].dispatcher.on('finish', () => {
            servidores[msg.guild.id].loopIn = false
            servidores[msg.guild.id].dispatcher.pause()
            servidores[msg.guild.id].fila = []
            servidores[msg.guild.id].titulo = []
            servidores[msg.guild.id].requisitado = []
            servidores[msg.guild.id].lofila = []
            servidores[msg.guild.id].lotitulo = []
            servidores[msg.guild.id].lorequisitado = []
            servidores[msg.guild.id].dispatcher = null
            servidores[msg.guild.id].estouTocando = false
            servidores[msg.guild.id].connection = null
        })
        

    }
    else {
        servidores[msg.guild.id].loopIn = true

        //cria a fila de loop
        for (let i in servidores[msg.guild.id].requisitado) {
            servidores[msg.guild.id].lorequisitado.push(servidores[msg.guild.id].requisitado[i])
        }
        for (let i in servidores[msg.guild.id].titulo) {
            servidores[msg.guild.id].lotitulo.push(servidores[msg.guild.id].titulo[i])
        }
        for (let i in servidores[msg.guild.id].fila) {
            servidores[msg.guild.id].loop.push(servidores[msg.guild.id].fila[i])
        }
        msg.channel.send('Loop de fila ativado!')
        tocaLoop(msg)
    }

}