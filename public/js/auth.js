
const formulario = document.querySelector('form')

formulario.addEventListener('submit', (evento) =>{
    evento.preventDefault()
    const formData = {   
        correo: document.querySelector('input[name="correo"]').value,
        password: document.querySelector('input[name="password"]').value
    }
    // token
    fetch('http://localhost:8080/api/auth/login', {
         method: 'POST',
         headers:{
             'Content-Type':'application/json'
         },
         body: JSON.stringify(formData)})
         .then(resp => resp.json())
         .then(({token}) => {
             localStorage.setItem('token', token)
             window.location = 'chat.html'
         })
         .catch(error => console.log(error))
    
   
    
    
    
    
})



function handleCredentialResponse(response) {
    // token google
     fetch('http://localhost:8080/api/auth/google', {
         method: 'POST',
         headers:{
             'Content-Type':'application/json'
         },
         body: JSON.stringify({id_token: response.credential})})
         .then(resp => resp.json())
         .then(({token_user}) => {
             localStorage.setItem('token', token_user)
             window.location = 'chat.html'
         })
         .catch(error => console.log(error))
}
let google_signout = document.getElementById('google_signout') 
       
       google_signout.onclick = () =>{
        google.accounts.id.disableAutoSelect()
        google.accounts.id.revoke(localStorage.getItem('email'), done =>{
            localStorage.clear()
            location.reload()
        })
       }
 