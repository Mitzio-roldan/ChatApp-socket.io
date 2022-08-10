const {Router} = require('express')
const {body, check} = require('express-validator')
const controllerUser = require('../controllers/users')
const {db_validator, email_validator, existe_usuario} = require('../helpers/db_validator')

const {validarJWT, validar_roles, validar_campos} = require('../middlewares')
const cors = require('cors')
const router = Router()

router.get('/', controllerUser.usuariosGet)

router.put('/:id', [
    check('id', "No es un id de Mongo").isMongoId(),
    check('id').custom(existe_usuario),
    body('rol').custom(db_validator),
    validar_campos
],controllerUser.usuariosPut)

router.post('/',[
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'El password debe tener mas de 6 letras').isLength( {min: 6} ),
    body('correo').custom(email_validator),
    body('rol').custom(db_validator),
    validar_campos
],controllerUser.usuariosPost)

router.delete('/:id',[
    validarJWT,
    validar_roles(['ADMIN_ROLE']),
    check('id', "No es un id de Mongo").isMongoId(),
    check('id').custom(existe_usuario),
    validar_campos
] ,controllerUser.usuariosDelete)

router.patch('/', controllerUser.usuariosPatch)

module.exports = router