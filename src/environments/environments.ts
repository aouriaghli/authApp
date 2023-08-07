
//Esto habria que generarlo automaticamente mediante un script, como se ha hecho en algun ejercicio anteriormente.

/* esto para cuando debugueamos el backend en local
export const environment = {
    baseUrl: 'http://localhost:3000' //url de nuestro backend, en este caso el creado en el ejercicio anterior creado con nestjs
}*/

//Tras subir el backend a railway, obtengo una url que voy a usar aqui antes de desplegar my web app
export const environment = {
  baseUrl: 'https://nestbackend-aor.up.railway.app' //url de nuestro backend, en este caso el creado en el ejercicio anterior creado con nestjs
}
