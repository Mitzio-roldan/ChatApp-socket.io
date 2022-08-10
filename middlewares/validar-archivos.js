const validarArchivos = (req, res, next) =>{
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json('No se subieron archivos');
      }
      next()
}
module.exports = validarArchivos