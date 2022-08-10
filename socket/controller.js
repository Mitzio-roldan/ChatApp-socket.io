const {comprobarJWT} = require('../helpers/generar_jwt')
const ChatMensaje = require('../models/chat-mensaje')
const chatMensaje = new ChatMensaje()

const SocketController = async (socket, io) =>{
    const user = await comprobarJWT(socket.handshake.headers['x-token'])
    if (!user) {
        return socket.disconnect();
    }

    chatMensaje.agregarUsuario(user)
    io.emit('usuarios-activos', chatMensaje.usuariosArr)
    socket.emit('recibir-mensaje', chatMensaje.ultimos10)
    
    socket.join(user.id)

    socket.on('disconnect', ()=>{
        chatMensaje.desconectarUsuario(user.id)
        io.emit('usuarios-activos', chatMensaje.usuariosArr)
    })

    socket.on('enviar-mensaje', ({uid ,mensaje}) =>{
        
        if (uid) {
            
            let existe_user = io.sockets.adapter.rooms.get(uid)
            if (existe_user) {
                const data = {
                    nombre: user.nombre,
                    mensaje
                }
                
                socket.to(uid).emit('mensaje-privado', data)
            }
        }
        else{
            
            chatMensaje.enviarMensaje(user.id, user.nombre, mensaje)
            io.emit('recibir-mensaje', chatMensaje.ultimos10)
        }
    })




}
module.exports = SocketController;