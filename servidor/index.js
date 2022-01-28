import express from "express";//Importe de la librería de express
import cors from "cors";//Importe de los cors para permitir la conexión del front-end con el back-end
import bodyParser from "body-parser";//Importe de esta librería para poder leer un request desde el servidor

let lastId = 1;
let productos = [ // Debería ser const pero se le pone let para evitar que cuando se elimine un arreglo, aparezca un null en lugar del producto eliminado
    {
        nombre: "Producto B",
        cantidad: 1,
        precio: 10,
        codigo: lastId,
        total: 10
    }
];

const app = express();//Uso de express

app.use(cors());//Se hace uso del CORS
app.use(bodyParser.json({ type: 'application/json' }));//Leer un JSON por medio de la librería BodyParser
app.use(logs);//Se despliega en la consola el request utilizado y la ruta

app.get("/", (req, res) => res.send("<h1>API de productos</h1>"));//Ruta número 1 (la raíz)

app.get("/productos", (req, res) => {
    const filtro = req.query.filtro;//Obtener el filtro del query

    if (filtro){//Si se obtiene un filtro:
        res.json(productos.filter(p => p.nombre.indexOf(filtro) >= 0));//Se retornan los productos coincidentes con el filtro
    } else {//Si no:
        res.json(productos);//Se retornan todos los productos
    }
    });//Ruta número 2
app.post("/productos", (req, res) => {//Efectuar un post en esta ruta
    lastId++;//Incrementar este contador en 1 para el código cada vez que se cree un producto
    const { cantidad, precio } = req.body; //Obtener la cantidad y el precio del request del body
    const producto = {...req.body, codigo: lastId, total: cantidad * precio};
    productos.push(producto);//Se está agregando el arreglo de productos directamente
    res.status(201);//Asignar el estado de la respuesta
    res.json(producto)//Asignar este archivo .json para la respuesta del POST
});

app.get("/productos/:codigo", (req, res) => {//Un put para un producto en específico
    const codigo = parseInt(req.params.codigo, 10);//Código recibido desde el request de usuario, convirtiéndolo a entero, en base 10 (lo que indica el segundo parámetro)
    const producto = productos.find(p => p.codigo == codigo)//Obtener el producto solicitado
    
    if (!producto)//Si el producto no existe
    {
        res.status(404);//Asignar el estado de la respuesta
        res.json({ mensaje: "No existe ningún producto con código " + codigo })//Asignar este archivo .json para la respuesta del POST
    } else {
        res.status(200);//Todo está bien
        res.json(producto);//Enviar un mensaje con el JSON del producto modificado con sus nuevos valores
    }
});

app.put("/productos/:codigo", (req, res) => {//Un put para un producto en específico
    const codigo = parseInt(req.params.codigo, 10);//Código recibido desde el request de usuario, convirtiéndolo a entero, en base 10 (lo que indica el segundo parámetro)
    const producto = productos.find(p => p.codigo == codigo)//Obtener el producto solicitado
    
    if (!producto)//Si el producto no existe
    {
        res.status(404);//Asignar el estado de la respuesta
        res.json({ mensaje: "No existe ningún producto con código " + codigo })//Asignar este archivo .json para la respuesta del POST
    } else {
        const { cantidad, precio } = req.body; //Obtener la cantidad y el precio del request del body
        const index = productos.indexOf(producto);//Buscar este producto en el arreglo de productos
        const nuevoProducto = productos[index] = { ...req.body, codigo, total: cantidad * precio };//Se modifica el arreglo directamente, en el índice especificado
        res.status(200);//Todo está bien
        res.json(nuevoProducto);//Enviar un mensaje con el JSON del producto modificado con sus nuevos valores
    }
});

app.delete("/productos/:codigo", (req, res) => {//Un delete para un producto en específico
    const codigo = parseInt(req.params.codigo, 10);//Código recibido desde el request de usuario, convirtiéndolo a entero, en base 10 (lo que indica el segundo parámetro)
    const producto = productos.find(p => p.codigo == codigo)//Obtener el producto solicitado
    
    if (!producto)//Si el producto no existe
    {
        res.status(404);//Asignar el estado de la respuesta
        res.json({ mensaje: "No existe ningún producto con código " + codigo })//Asignar este archivo .json para la respuesta del POST
    } else {//Ahora bien, si el producto existe
        productos = productos.filter(x => x != producto);//Reasignar todos los productos menos el eliminado
        res.status(200);//Todo está bien
        res.json({ message: "Producto eliminado" });//Enviar un mensaje de que el producto se logró eliminar
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