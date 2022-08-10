const {Router} = require('express')
const {body, check} = require('express-validator')
const {db_validator, email_validator, existe_usuario, existeCategoria} = require('../helpers/db_validator')
const {validarJWT, validar_roles, validar_campos} = require('../middlewares')
const buscar_controller = require('../controllers/buscar')
const router = Router()

router.get('/:coleccion/:termino', buscar_controller.buscar)


module.exports = router