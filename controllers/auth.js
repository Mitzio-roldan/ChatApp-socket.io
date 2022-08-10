const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs');
const {generarJWT} = require('../helpers/generar_jwt')
const google_verify = require('../helpers/google_verify')
const controller = {

    login: async(req, res) =>{

        const {correo, password} = req.body
        try{
            // verificar email
            const usuario = await Usuario.findOne({correo})
            if (usuario) {
                if(usuario.estado){
                    const validPassword = bcrypt.compareSync(password, usuario.password)
                    if(validPassword){
                        
                        const token = await generarJWT(usuario.id)
                        return res.json({
                            usuario,
                            token
                        })    
                    }
                    
                    
                } 

            }
            
            return res.status(400).json({
                msg: 'User or password is incorrect'
            })
            
            // user activo o no

            // password ok

            // generar el JWT



        }catch{
            return res.status('500').json({
                msg: "Hable con el Administrador"
            })
        }

    },

    googleSingIn: async(req, res) =>{
        const{id_token} = req.body
        try {
            const {name, email, picture} = await google_verify(id_token)
            let usuario = await Usuario.findOne({correo: email})
            if (!usuario){
                const data = {
                    nombre: name,
                    correo: email,
                    password: 'test123456',
                    rol:'USER_ROLE',
                    google: true
                }

                usuario = new Usuario(data)
                await usuario.save();
            }
            if (!usuario.estado) {
                return res.status(401).json({
                    msg: "Usuario inactivo"
                })
            }
            const token_user = await generarJWT(usuario.id)
            res.json({
                usuario,
                token_user
            })

        } catch (error) {
            console.log(error);
        }
        
    },

    ronovarToken: async(req, res) =>{
        const {usuario} = req

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
    }

}

module.exports = controller 