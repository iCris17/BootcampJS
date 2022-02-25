//Acá vamos a hacer la conexión a la base de datos:
import mongoose from "mongoose";//Librería que me permite la conexión a la BD
import productos from "./productos";

//Callback
mongoose.connect("mongodb+srv://iCris17:stratech11@cluster0.h0ctw.mongodb.net/bootcampdb?retryWrites=true&w=majority", () => {
    console.log("Conectado a la base de datos");
})


export { productos };