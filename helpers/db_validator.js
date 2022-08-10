const Role = require('../models/role')
const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')
const db_validator = async (rol = '') => {        
    const existeRol = await Role.findOne({ rol })
    console.log(existeRol);
    if (!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la DB`)
    }
}

const email_validator = async(correo = "") =>{
    
    const existe_email = await Usuario.findOne({correo});
    if(existe_email){
        throw new Error(`El correo ${correo} ya está registrado en la DB`)
    }
}

const existe_usuario = async(id = "") =>{
    const existe_id = await Usuario.findById(id);
    if(!existe_id){
        throw new Error(`El id ${id}, no existe `)
    }
}

const existeCategoria = async (id = "") =>{
    const categoria = await Categoria.findById(id)
    if(!categoria){
        throw new Error(`Categoria no existe`)
    }
}

const existeProducto = async (id = '') =>{
    const producto = await Producto.findById(id)
    if(!producto){
        throw new Error(`Producto no existe`)
    }
}

const validarColeccionesPermitidas = (coleccion = '', colecciones= []) =>{
    const incluida = colecciones.includes(coleccion)
    if(!incluida){
        throw new Error(`Coleccion no existe`)
    }
    return true

}

module.exports = {db_validator, email_validator, existe_usuario, existeCategoria, existeProducto, validarColeccionesPermitidas};