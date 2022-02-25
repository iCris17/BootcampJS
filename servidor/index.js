import express from "express";//Importe de la librería de express
import cors from "cors";//Importe de los cors para permitir la conexión del front-end con el back-end
import bodyParser from "body-parser";//Importe de esta librería para poder leer un request desde el servidor
import { productos } from "./database";

const app = express();//Uso de express

app.use(cors());//Se hace uso del CORS
app.use(bodyParser.json({ type: 'application/json' }));//Leer un JSON por medio de la librería BodyParser
app.use(logs);//Se despliega en la consola el request utilizado y la ruta

app.get("/", (req, res) => res.send("<h1>API de productos</h1>"));//Ruta número 1 (la raíz)

app.get("/productos", async (req, res) => {
    const filtro = req.query.filtro;//Obtener el filtro del query
    let result;

    if (filtro){//Si se obtiene un filtro:
        result = await productos.filter(filtro);
    } else {//Si no:
        result = await productos.all();
    }
    res.json(result);
});//Ruta número 2

app.post("/productos", async (req, res) => {//Efectuar un post en esta ruta
    const producto = await productos.add(req.body);
    res.status(201);//Asignar el estado de la respuesta
    res.json(producto)//Asignar este archivo .json para la respuesta del POST
});

app.get("/productos/:codigo", async (req, res) => {//Un put para un producto en específico
    const codigo = parseInt(req.params.codigo, 10);//Código recibido desde el request de usuario, convirtiéndolo a entero, en base 10 (lo que indica el segundo parámetro)
    const producto = await productos.single(codigo);
    
    if (!producto)//Si el producto no existe
    {
        res.status(404);//Asignar el estado de la respuesta
        res.json({ mensaje: "No existe ningún producto con código " + codigo })//Asignar este archivo .json para la respuesta del POST
    } else {
        res.status(200);//Todo está bien
        res.json(producto);//Enviar un mensaje con el JSON del producto modificado con sus nuevos valores
    }
});

app.put("/productos/:codigo", async (req, res) => {//Un put para un producto en específico
    const codigo = parseInt(req.params.codigo, 10);//Código recibido desde el request de usuario, convirtiéndolo a entero, en base 10 (lo que indica el segundo parámetro)
    try {
        const newProducto = await productos.update(codigo, req.body);    
        res.status(200);
        res.json(newProducto);
    } catch (mensaje) {
        res.status(404);//Asignar el estado de la respuesta
        res.json({ mensaje });//Asignar este archivo .json para la respuesta del POST
    }
});

app.delete("/productos/:codigo", async (req, res) => {//Un delete para un producto en específico
    const codigo = parseInt(req.params.codigo, 10);//Código recibido desde el request de usuario, convirtiéndolo a entero, en base 10 (lo que indica el segundo parámetro)

    try {
        await productos.remove(codigo);
        res.status(200);//Todo está bien
        res.json({ message: "Producto eliminado" });//Enviar un mensaje de que el producto se logró eliminar
    } catch (mensaje) {
        res.status(404);//Asignar el estado de la respuesta
        res.json({ mensaje: "No existe ningún producto con código " + codigo })//Asignar este archivo .json para la respuesta del POST
    }
});

app.listen(5001, () => {
    console.log("servidor express escuchando en puerto 5001");//Escuchar al puerto 5000 de la app
});

/*
function isAuthenticated(req, res, next) {
    
    const auth = req.headers.authorization;//Header de autenticación de los usuarios
    if (auth == "hola-mundo"){//Esta es la contraseña
        next();//Mostrar lo que corresponda a la ruta que pide el token de autenticación
    } else {
        res.status(401);//No hay permisos para ver un recurso en específico
        res.send("Not authorized");
    }
}*/

function logs(req, res, next){//Middleware para el login de esta aplicación
    console.log(`${req.method}: ${req.originalUrl}`);//Se llama a un método que obtiene el tipo de request empleado y la ruta
    next();
}