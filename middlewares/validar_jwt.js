const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario')

const validarJWT = async (req, res, next) => {

    const token = req.header('x-token')

    if(!token){
        return res.status('400').json({
            msg: 'No hay token'
        })
    }
    try {
        
        const {uid} = jwt.verify(token, process.env.PRIVATEKEY)
        const user = await Usuario.findById(uid)
        if(!user){
            return res.status(401).json({
                msg: 'Token no valido - Usuario no existe'
            })
        }
        if (!user.estado) {
            return res.status(401).json({
                msg: 'Token no valido - Usuario con estado: false'
            })
        }
        
        req.usuario = user
        req.uid = uid
        next()

    } catch (error) {
        console.log(error);
        res.status('400').json({
            msg: 'token invalido'
        })
    }

    

}
module.exports = validarJWT

