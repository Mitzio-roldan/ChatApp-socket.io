const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')

const generarJWT = async(uid = "") =>{
  return new Promise((resolve, reject) => {
    
    jwt.sign({uid}, process.env.PRIVATEKEY, {
        expiresIn:'4h'
    }, (err, token) =>{
        if(err){
            console.log(err);
            reject('No se pudo generar el token')
        }
        resolve(token)
    })

  })
}

const comprobarJWT = async(token = '') =>{

  try {
    if (token.length < 10) {
      return null
    }
    
    const {uid} = jwt.verify(token, process.env.PRIVATEKEY)
    
    const user = await Usuario.findById(uid)

        if(!user){
            return null
        }
        if (!user.estado) {
          return null
        }
        
       return user
        
  } catch (error) {
    return null

  }



}
module.exports = {generarJWT, comprobarJWT}