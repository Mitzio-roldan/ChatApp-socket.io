const txtUid = document.querySelector('#txtUid')
const txtMens = document.querySelector('#txtMens')
const ulMensjaes = document.querySelector('#ulMensjaes')
const ulMensjaesPrivados = document.querySelector('#ulMensjaesPrivados')
const btnSalir = document.querySelector('#btnSalir')
const ulUsuarios = document.querySelector('#ulUsuarios')

const user = null
let socket = null

const validarJWT = async () =>{
    
    const token = localStorage.getItem('token')
    if (token <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token')
    }
    
    const resp = await fetch ('http://localhost:8080/api/auth/',{
        headers: {'x-token': token}
    })
    const {usuario: userDB, token: tokenDB} = await resp.json();
    localStorage.setItem('token', tokenDB)
    usuario = userDB
    document.title = usuario.nombre
    
    await conectarSocket()
    
}

const conectarSocket= async() =>{

    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    })

    socket.on('connect', ()=>{
        console.log('Socket Online');
    })
    
    socket.on('disconnect', ()=>{
        console.log('Socket Offline');
    })

    socket.on('recibir-mensaje', (payload)=>{
        dibujarMensajes(payload, ulMensjaes);
    })

    socket.on('usuarios-activos', (payload)=>{
        dibujarUsuarios(payload);
    })

    socket.on('mensaje-privado', (payload)=>{
        dibujarMensajes([payload], ulMensjaesPrivados)
    })

}

const dibujarUsuarios = (usuarios) =>{
    ulUsuarios.innerHTML = ''
    usuarios.forEach((element, index) => {
        ulUsuarios.innerHTML += `<li>
        <p>
        <h5 class="text-success">${element.nombre}</h5>
        <span >${element.uid}</span>
        </p>
        </li>`
    });
    
}

const dibujarMensajes = (mensajes, objetoHTML) =>{
    objetoHTML.innerHTML = ''
    console.log(mensajes);
    mensajes.forEach((element, index) => {
        objetoHTML.innerHTML += `<li>
        <p>
        <span class="text-success">${element.nombre}:</span>
        <span class= "fs-6 text-muted"> ${element.mensaje}</span>
        </p>
        </li>`
    });

}

txtMens.addEventListener('keyup', ({keyCode}) =>{
    if(keyCode == 13)
    {
        if (txtMens.value === '') {
            return
        }
        if(txtUid.value === ''){
            socket.emit('enviar-mensaje', ({mensaje: txtMens.value}))
        }
        else{
            socket.emit('enviar-mensaje', ({mensaje: txtMens.value, uid: txtUid.value}))
        }
        
        txtMens.value = ''
    }
})


const main = async() =>{

    await validarJWT()

}

main()