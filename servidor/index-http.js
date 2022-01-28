//var miVariable = "hola mundo";

//console.log("window: ", window); //Esta variable no existe en el lado del servidor
//console.log("document: ", document); //Esta variable no existe en el lado del servidor
//console.log("miVariable: ", window.miVariable); //Al no existir window acá, no se puede hacer display de este console.log()

//console.log("dirname: ", __dirname); //Despliega la ruta de este archivo
//console.log("filename: ", __filename);//Despliega la ruta completa, con el archivo incluido
//console.log("process: ", process);//Despliega un objeto enorme, como la versión de node, info del SO, etc.
//console.log("arguments: ", process.argv);//Despliega la ubicación de node y de dónde se ejecuta este archivo

//Se tuvo que importar una propiedad extra en un package.json (además de crearlo) que fue el type, para permitir el uso de esta sintaxis
import http from "http";//No es necesario instalar estas librerías con npm pues ya las incluye node
//const http = require("http");//Es la forma de implementar la librería http pues la anterior no es compatible con la versión más reciente de node

const server = http.createServer((req, res) => {

    res.writeHead(200, { "Content-Type": "application/json" })//Indicar un código de que se ejecutó la app con éxito, enviando un header el cual es el tipo de contenido que se le está enviando 
    res.write(JSON.stringify([
        {
            codigo: 1, 
            nombre: "producto 1", 
            precio: 10, 
            cantidad: 100
        },
        {
            codigo: 2, 
            nombre: "producto 2", 
            precio: 50, 
            cantidad: 200
        }
    ]));//Escribir algo
    res.end();//Avisar a node de que ya se terminó de crear el response y que ya se le puede enviar al cliente el request

})

server.listen(5000, () => {
    console.log("Servidor escuchando en puerto 5000");//Escuchar a la aplicación, se abrirá en el puerto 5000
})