const categoria = require('../models/categoria')
const Producto = require('../models/producto')

const controller = {

    //Obtener productos
    obtenerProductos: async (req, res) =>{
        const {limit = 5, desde = 0} = req.query
        const query = {estado: true}

        const [total, producto] = await Promise.all([
            Producto.count(query),
            Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limit))
        ])

        res.json({
            total,
            producto
        })


    },

    // Obtener producto por id
    obtenerProducto: async (req, res) =>{
        const id = req.params.id
        const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
         
        res.json({
            producto
        })

    },

    // Crear producto
    crearProducto: async(req, res) =>{
        const {nombre, precio = 0, descripcion = '', categoria} = req.body
        const existeProducto =  await Producto.findOne({nombre})
        if(existeProducto){
            res.status(400).json({
                msg:'El producto con ese nombre ya existe'
            })
        }
        const data = {
            nombre,
            precio,
            descripcion,
            categoria,
            usuario: req.usuario._id
        }
        const producto = new Producto(data)
        await producto.save()

        res.json({
            msg:'Producto creado'
        })
    },

    //Modificar Producto:

    modificarProducto: async(req,res) =>{
        const id = req.params.id
        const {nombre, descripcion = '', precio = 0, categoria} = req.body
        const data = {
            nombre,
            descripcion,
            precio,
            categoria,
            usuario: req.usuario._id
        }
        const producto = await Producto.findByIdAndUpdate(id, data)
        res.json({
            producto
        })

    },
    
    // Eliminar producto
    eliminarProducto: async(req, res) =>{
        const id = req.params.id

        const producto = await Producto.findByIdAndUpdate(id, {estado : false})

        res.json({
            producto
        })
    }


}
module.exports= controller