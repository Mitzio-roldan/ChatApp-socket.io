const { response, query } = require('express')

const Usuario = require('../models/usuario')
var bcrypt = require('bcryptjs');
const { Promise } = require('mongoose');


const controller = {
    usuariosGet: async (req, res = response) => {
        const {limit = 5, desde = 0} = req.query
        const query = {estado: true}
        

        const [total, usuarios] = await Promise.all([
             Usuario.count(query),
             Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
        ])

        res.status('200').json({
            total, 
            usuarios
        })

    },

    usuariosPost: async (req, res) => {
        
        const { nombre, correo, password, rol } = req.body
        const usuario = new Usuario({ nombre, correo, password, rol })




        let salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync(req.body.password, salt);

        await usuario.save()

        res.json({
            usuario
        })
    },

    usuariosPut: async (req, res) => {
        const id = req.params.id
        
        const{_id, password, google, ...resto} = req.body


        if(password){
            let salt = bcrypt.genSaltSync(10);
            resto.password = bcrypt.hashSync(password, salt);

        }

        const usuario = await Usuario.findByIdAndUpdate(id, resto)
        
        res.json({
            usuario
        })

    },

    usuariosDelete: async (req, res) => {
        const id = req.params.id
        const uid = req.params.uid
        const usuario_autenticado = req.usuario
        

        const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
        
        
        
        res.status('200').json({
            usuario,
            usuario_autenticado: usuario_autenticado  
        })

    },

    usuariosPatch: (req, res) => {
        res.status('200').json({
            ok: true,
            msg: 'Patch'
        })

    },
}

module.exports = controller;