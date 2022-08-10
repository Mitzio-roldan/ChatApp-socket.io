const {Router} = require('express')
const {body, check} = require('express-validator')
const {db_validator, email_validator, existe_usuario, existeCategoria, existeProducto} = require('../helpers/db_validator')
const {validarJWT, validar_roles, validar_campos} = require('../middlewares')
const producto_controller = require('../controllers/productos')
const router = Router()


//Obtener Productos
router.get('/', producto_controller.obtenerProductos)

// Obtener producto por id
router.get('/:id', [
    check('id').custom(existeProducto),
    validar_campos
],producto_controller.obtenerProducto)

// Crear Producto
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoria),
    validar_campos
],
producto_controller.crearProducto)

//Modificar Producto
router.put('/:id', [
    validarJWT,
    check('id').custom(existeProducto),
    check('categoria').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    validar_campos
],producto_controller.modificarProducto)

// Eliminar Producto

router.delete('/:id',[
    validarJWT,
    validar_roles(['ADMIN_ROLE', 'USER_ROLE']),
    check('id').custom(existeProducto),
    validar_campos
],producto_controller.eliminarProducto)


module.exports = router