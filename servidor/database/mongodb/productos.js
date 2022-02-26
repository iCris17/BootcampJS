//A diferencia del archivo productos.js de la carpeta in-memory, este archivo va a funcionar con la DB desplegada en Atlas
import mongoose from "mongoose";

//No se incluye un id pues Atlas de MongoDB ya me lo genera
const productosSchema = mongoose.Schema({
   nombre: { type: String, required: true },
   categoria: { type: Number, required: true },
   cantidad: { type: Number, required: true },
   precio: { type: Number, required: true },
   total: { type: Number, required: true }, 
});

//Se define una variable para usar el modelo de la colección productos
const Productos = mongoose.model("productos", productosSchema);

// Buscar todos los productos:
const all = () => Productos.find({}).then(mapProductos);
// Buscar los productos mediante un filtro, $regex es una expresión regular, y eso es lo que quiero buscar, y el $options indica que no distinga entre mayúsculas y minúsculas:
const filter = (filtro) => Productos.find({ nombre: { $regex: filtro, $options: "i"} }).then(mapProductos);
// Agregar un producto:
const add = (producto) => {
    //Se genera el producto, pero se agrega también su total:
    const nuevoProducto = new Productos({...producto, total: producto.cantidad * producto.precio });
    //Se guarda este producto:
    return nuevoProducto.save().then(mapProducto);
}
// Buscar un producto, con el método de MongoDB de findOne():
const single = (_id) => Productos.findOne({ _id }).then(mapProducto);
// Actualizar un producto, con el método de MongoDB findOneAndUpdate(),
// Los criterios son: 
// _id: El registro que quiero buscar y actualizar con este id
// producto: Se le envía un nuevo objeto con los nuevos valores
// new: true: Se sobreescribe el registro viejo, si no se pone, nos deja el registro anterior
const update = (_id, producto) => Productos.findOneAndUpdate({ _id }, producto, { new: true}).then(mapProducto);
// Eliminar un producto, desde su id:
const remove = (_id) => Productos.findOneAndRemove({ _id }).then(mapProducto);

//Esta función recibe todos los productos con el campo _id
function mapProductos(productos){
    //Va a retornar el _id como codigo
    //Se convierte a JSON pues es un BSON (se define el tipo de dato, tiene más metadata)
    return productos.map(p => ({...p.toJSON(), codigo: p._id}));
}

//Esta función recibe todos los productos con el campo _id
function mapProducto(producto){
    //Va a retornar el _id como codigo
    //Se convierte a JSON pues es un BSON (se define el tipo de dato, tiene más metadata)
    if (producto)
        return {...producto.toJSON(), codigo: producto._id};
    return null;
}

//Exportar funciones:
export default {
    all,
    filter,
    add,
    single,
    update,
    remove
}