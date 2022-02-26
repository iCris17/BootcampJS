//Acá vamos a hacer la conexión a la base de datos:
import mongoose from "mongoose";//Librería que me permite la conexión a la BD
import productos from "./productos";

//Constante que se genera, para obtener el valor de la variable de entorno desde el archivo .env, para evitar vulnerabilidades del sistema. Si alguien no tiene la API de Atlas,
//sencillamente se le hace un deploy en localhost
const mongodbUri = process.env.MONGODB_URI || "mongodb://localhost:27017/productos";

//Callback
mongoose.connect(mongodbUri, () => {
    console.log("Conectado a la base de datos");
})


export { productos };