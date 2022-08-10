const {Router} = require('express')
const {body, check} = require('express-validator')
const {db_validator, email_validator, existe_usuario} = require('../helpers/db_validator')
const validar_jwt = require('../middlewares/validar_jwt')
const validar_campos = require('../middlewares/validar_campos')
const authController = require('../controllers/auth')
const router = Router()

router.post('/login',[
    
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validar_campos
] ,authController.login)

router.post('/google', [
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validar_campos
], authController.googleSingIn)

router.get('/', validar_jwt, authController.ronovarToken)

module.exports = router;