const {ObjectId} = require('mongoose').Types


const Categoria = require("../models/categoria")
const Producto = require("../models/producto")
const Usuario = require("../models/usuario")



const coleccionesPermitidas = [
     'usuarios',
     'categorias',
     'productos',
     'roles'
]

const controller = {
    
    buscarUsuario: async(termino = '', res) =>{
        
        // Busqueda por id
        if(ObjectId.isValid(termino)){
            const usuario = await Usuario.findById(termino)
            return res.json({
                results : (usuario) ? usuario : []
            })
        }
        
        // diferentes terminos 
        const regex = new RegExp(termino, 'i')
        const usuario = await Usuario.find({
            $or: [{nombre: regex}, {correo: regex}],
            $and: [{estado : true}]
        })
        if (usuario) {
            return res.json({
                results : (usuario) ? usuario : []
            })
        }
        
    },

    buscarCategoria: async(termino = '', res) =>{
        if(ObjectId.isValid(termino)){
            const categoria = await Categoria.findById(termino)
            return res.json({
                resultados: (categoria) ? categoria : []
            })
        }
        const regex = new RegExp(termino, 'i')
        const categoria = await Categoria.find({nombre: regex})

        return res.json({
            resultados: (categoria) ? categoria : []
        })

    },

    buscarProductos: async (termino = '', res) =>{
        if(ObjectId.isValid(termino)){
            const producto = await Producto.findById(termino)
            return res.json({
                resultados: (producto) ? producto : []
            })
        }
        const regex =  new RegExp(termino, 'i')
        const producto = await Producto.find({nombre: regex})
                        .populate('categoria', 'nombre')
        return res.json({
            resultados: (producto) ? producto : []
        })
    },
    
    
    buscar: async (req, res) =>{
        const {coleccion, termino} = req.params

        if(coleccionesPermitidas.includes(coleccion.toLowerCase())){
            switch (coleccion) {
                case coleccionesPermitidas[0]:
                    controller.buscarUsuario(termino, res)
                    break;
            
                case coleccionesPermitidas[1]:
                    controller.buscarCategoria(termino, res)
                    break;

                case coleccionesPermitidas[2]:
                    controller.buscarProductos(termino, res)
                    break;

                default:
                    break;
            }




        }
        

    }
}
module.exports = controller