const validar_roles = (roles = []) =>{

return (req, res, next) =>{

    console.log(roles);
    if(!req.usuario){
        return res.status(400).json({
            msg: "No tenes un auth"
        })
    }
    const include_rol = roles.includes(req.usuario.rol)
    if(!include_rol){
        return res.status(401).json({
        msg: "No tiene el rol correspondiente"
    })
}

next()
}
    


}

module.exports = validar_roles