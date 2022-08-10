const express = require('express')
const cors = require('cors')
const SocketController = require('../socket/controller')
const fileUpload = require('express-fileupload')

const dbConnection = require('../database/config')
class server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT

        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.middlwares()
        this.routes()
        this.conectarDB()
        this.socket()
    }
    middlwares(){
        this.app.use(express.static('public'));
        this.app.use(cors())
        this.app.use(express.json())
        // carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }
    async conectarDB(){
        await dbConnection()
    }

    routes(){
        this.app.use('/api/auth', require('../routes/auth'))
        this.app.use('/api/usuarios', require('../routes/user'))
        this.app.use('/api/categorias', require('../routes/categorias'))
        this.app.use('/api/productos', require('../routes/productos'))
        this.app.use('/api/buscar', require('../routes/buscar'))
        this.app.use('/api/uploads', require('../routes/uploads'))

    }

    socket(){
        this.io.on('connection', (socket) => SocketController(socket, this.io))
    }



    listen(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening on port ${this.port}`)
          })
    }
}
module.exports = server