const {check} = require('express-validator')
const {Router} = require('express')
const {db_validator, email_validator, existe_usuario, existeCategoria, existeProducto, validarColeccionesPermitidas} = require('../helpers/db_validator')
const {validarJWT, validar_roles, validar_campos} = require('../middlewares')
const validarArchivos = require('../middlewares/validar-archivos')
const uploadsController = require('../controllers/uploads')

const router = Router()

// cargar archivos
router.post('/', [validarArchivos],uploadsController.cargarArchivos)

// modificar achivo de colecciones 
router.put('/:coleccion/:id', [
    validarArchivos,
    check('id', 'El id es invalido').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validar_campos
],uploadsController.actualizarImagenesCloudinary)


router.get('/:coleccion/:id', [
    check('id', 'El id es invalido').isMongoId(),
    check('coleccion').custom(c => validarColeccionesPermitidas(c, ['usuarios', 'productos'])),
    validar_campos
],uploadsController.mostrarImagen)

module.exports = router
