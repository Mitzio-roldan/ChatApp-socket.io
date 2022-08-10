const {Router} = require('express')
const {body, check} = require('express-validator')
const {db_validator, email_validator, existe_usuario, existeCategoria} = require('../helpers/db_validator')
const {validarJWT, validar_roles, validar_campos} = require('../middlewares')
const categoria_controller = require('../controllers/categorias')
const router = Router()
// obtener todas las categorias
router.get('/', categoria_controller.obtenerCategorias)

// obtener categorias por id

router.get('/:id', [
    check('id').custom(existeCategoria),
    validar_campos
],
categoria_controller.obtenerCategoria)
 
// Crear categoria
router.post('/',[
    validarJWT,
    check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
    validar_campos
], categoria_controller.crearCategoria)

// Modificar categoria
router.put('/:id', [
    validarJWT,
    validar_roles(['ADMIN_ROLE', 'USER_ROLE']),
    check('nombre', 'EL nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validar_campos
]
,categoria_controller.modificarCategoria)

// Eliminar categoria
router.delete('/:id', [
    validarJWT,
    validar_roles(['ADMIN_ROLE', 'USER_ROLE']),
    check('id').custom(existeCategoria),
    validar_campos
],categoria_controller.borrarCategoria)


module.exports = router;