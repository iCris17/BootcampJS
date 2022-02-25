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
const all = () => Productos.find({});
// Buscar los productos mediante un filtro, $regex es una expresión regular, y eso es lo que quiero buscar, y el $options indica que no distinga entre mayúsculas y minúsculas:
const filter = (filtro) => Productos.find({ nombre: { $regex: filtro, $options: "i"} });
// Agregar un producto:
const add = (producto) => {
    //Se genera el producto, pero se agrega también su total:
    const nuevoProducto = new Productos({...producto, total: producto.cantidad * producto.precio });
    //Se guarda este producto:
    return nuevoProducto.save();
}
// Buscar un producto, con el método de MongoDB de findOne():
const single = (_id) => Productos.findOne({ _id });
// Actualizar un producto, con el método de MongoDB findOneAndUpdate(),
// Los criterios son: 
// _id: El registro que quiero buscar y actualizar con este id
// producto: Se le envía un nuevo objeto con los nuevos valores
// new: true: Se sobreescribe el registro viejo, si no se pone, nos deja el registro anterior
const update = (_id, producto) => Productos.findOneAndUpdate({ _id }, producto, { new: true});
// Eliminar un producto, desde su id:
const remove = (_id) => Productos.findOneAndRemove({ _id });

//Exportar funciones:
export default {
    all,
    filter,
    add,
    single,
    update,
    remove
}