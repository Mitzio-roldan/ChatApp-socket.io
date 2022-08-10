const Categoria = require('../models/categoria')
const generarJWT = require('../helpers/generar_jwt')
const google_verify = require('../helpers/google_verify')
const controller = {
    
    // obtener categorias - paginado - total - populate
    obtenerCategorias: async (req, res) =>{
        const {limit = 5, desde = 0} = req.query
        const query = {estado: true}
        

        const [total, categorias] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
        ])

        res.status('200').json({
            total, 
            categorias
        })


    },


    //obtener Categoria - populate
    obtenerCategoria:async (req, res) =>{
        const id = req.params.id
        const categoriaDB = await Categoria.findById(id).populate('usuario')
        return res.json({
            categoriaDB
        })


    },

    
    // crear categoria
    crearCategoria: async (req, res) =>{
        const nombre = req.body.nombre.toUpperCase()
        const categoriaDB = await Categoria.findOne({nombre})
        if(categoriaDB){
            return res.status(400).json({
                msg: `La categoria ${categoriaDB.nombre}, ya existe` 
            })
        }
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        const categoria = new Categoria(data)
        await categoria.save()

        res.status(201).json({
            categoria
        })
    },

    // actualizar categoria
    modificarCategoria: async (req, res) =>{
        const id = req.params.id;
        const nombre = req.body.nombre.toUpperCase();
        const data = {
            nombre,
            usuario: req.usuario._id
        }
        const categoria = await Categoria.findByIdAndUpdate(id, {data},{
            returnOriginal: false
        })
        res.json({
            categoria
        })


    },
    
    //borrar categoria - estado: false
    borrarCategoria: async (req, res) =>{
        const id = req.params.id
        const estado = {estado: false}
        const categoria = await Categoria.findByIdAndUpdate(id, estado, {
            returnOriginal: false
        })
        res.json({
            categoria
        })
    }


}

module.exports = controller 