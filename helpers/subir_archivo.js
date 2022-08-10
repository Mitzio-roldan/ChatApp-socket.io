const { log } = require('console');
const path = require('path')
const { v4: uuidv4 } = require('uuid');

 

const subirArchivo = async (files, extensionesValidas = ['jpg', 'png', 'img', 'jpeg', 'gif'], carpeta ='') =>{
    
    return new Promise ((resolve, reject) =>{
        const archivo = files.archivo;
        const nombre = archivo.name.split('.')
        const extension = nombre[nombre.length - 1];
        
        if(!extensionesValidas.includes(extension)){
            return reject('Extension no valida')

        }
      
        const nombre_archivo = `${uuidv4()}.${extension}`
        const uploadPath = path.join(__dirname,  '../uploads/' , carpeta, `${nombre_archivo}`);
        
        archivo.mv(uploadPath, function(err) {
          if (err) {
            return reject(err)
          }

          return resolve(nombre_archivo);
        });



    })
      
}
module.exports = subirArchivo