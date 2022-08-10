const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const Categoria = require("../models/categoria")
const Producto = require("../models/producto")
const Usuario = require("../models/usuario")


const subirArchivo = require('../helpers/subir_archivo')

const extensionesValidas = ['jpg', 'png', 'img', 'jpeg', 'gif']

const controller = {
    
    cargarArchivos: async(req, res) =>{
      
      try {
        const archivos = await subirArchivo(req.files)
        return res.json({
            msg: 'Archivo subido'
        })  
      } catch (error) {
        res.status(400).json({error})
      }

    },

    actualizarImagenes: async(req, res) =>{
        
        const {coleccion, id} = req.params
        let modelo
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: "Usuario con es id no existe"
                    })
                }
                break;
                
            case 'productos':
                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: "Producto con ese id no existe"
                    })
                }
                break;

            default:
                break;
        }
        
        if(modelo.img){
            const path_img = path.join(__dirname, '../uploads', coleccion, modelo.img)
            
            if(fs.existsSync(path_img)){
                
                fs.unlinkSync(path_img)
            }
        }
        
        
        
        const archivos = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = archivos

        await modelo.save()
        
        
        res.json({
            coleccion,
            id
        })


    },


    actualizarImagenesCloudinary: async(req, res) =>{
        
        const {coleccion, id} = req.params
        let modelo
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: "Usuario con es id no existe"
                    })
                }
                break;
                
            case 'productos':
                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: "Producto con ese id no existe"
                    })
                }
                break;

            default:
                break;
        }
        
        if(modelo.img){
            const nombreArchivo = modelo.img.split('/')
            const nombre = nombreArchivo[nombreArchivo.length - 1]
            const [public_id] = nombre.split('.')
            cloudinary.uploader.destroy(public_id)
        }
        
        
        
        const {tempFilePath} = req.files.archivo
        const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
        modelo.img = secure_url

        await modelo.save()
        
        
        res.json({
            modelo
        })


    },


    mostrarImagen: async(req, res) =>{


        const {coleccion, id} = req.params
        let modelo
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: "Usuario con es id no existe"
                    })
                }
                break;
                
            case 'productos':
                modelo = await Producto.findById(id)
                if (!modelo) {
                    return res.status(400).json({
                        msg: "Producto con ese id no existe"
                    })
                }
                break;

            default:
                break;
        }
        
        if(modelo.img){
            const path_img = path.join(__dirname, '../uploads', coleccion, modelo.img)
            
            if(fs.existsSync(path_img)){
                
                return res.sendFile(path_img)
            }
        }
        const img_default = path.join(__dirname, '../assets', 'no-image.jpg')
        return res.sendFile(img_default)
        
    }

}
module.exports = controller
