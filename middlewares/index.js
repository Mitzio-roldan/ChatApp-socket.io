const validarJWT = require('../middlewares/validar_jwt')
const validar_roles = require('../middlewares/validar_roles')
const validar_campos = require('../middlewares/validar_campos')

module.exports = {
    validarJWT,
    validar_roles,
    validar_campos

}
