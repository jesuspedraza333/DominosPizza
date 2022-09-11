let user = document.querySelector('.user');
let pass = document.querySelector('.pass');
console.log(datos);
document.querySelector('.inputL').addEventListener('click', (e) => {
    e.preventDefault();
   
    if(datos) {
        if (user.value == "" && pass.value == "") alert("Inserte datos");
        else if(user.value == datos[0].user && pass.value == datos[0].pass){
           document.querySelector('.loginForm').submit();
        } else alert("Usuario invalido");
    }
    

});
