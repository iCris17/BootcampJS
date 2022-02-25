let lastId = 1;
const productos = [
    {
        nombre: "Producto B",
        cantidad: 1,
        precio: 10,
        codigo: lastId,
        total: 10
    }
];

const all = () => Promise.resolve(productos);//Obtener todos los productos
const filter = (filtro) => Promise.resolve(productos.filter(p => p.nombre.indexOf(filtro) >= 0));//Obtener sólo los productos buscados
const add = (producto) => {//Agregar un nuevo producto
    lastId++;//Agregar el código en 1
    const nuevoProducto = {...producto, codigo: lastId, total: producto.cantidad * producto.precio};//Se va a asignar al producto su código y se va a calcular el total
    productos.push(nuevoProducto);//Agregar el producto al arreglo de productos
    return Promise.resolve(nuevoProducto);//Retornar el producto creado
}
const single = (codigo) => Promise.resolve(productos.find(p => p.codigo == codigo));//Obtener un único producto
const update = (codigo, producto) => {//Actualizar el producto
    const old = productos.find(p => p.codigo == codigo);//Obtener el producto a modificar
    if(!old){//Si el producto con el código especificado no existe:
        return Promise.reject("No existe ningún producto con código " + codigo);//Retornar este error
    }
    //Estas líneas ya no se ejecutan si el Promise.reject es ejecutado
    const index = productos.indexOf(old);//Buscar este producto obtenido en el arreglo de productos
    const nuevoProducto = productos[index] = { ...producto, codigo, total: producto.cantidad * producto.precio };//Se asigna esta variable, a la vez que cambia el producto en esta posición
    //del arreglo
    return Promise.resolve(nuevoProducto);//Retornar el producto modificado
}
const remove = (codigo) => {
    const producto = productos.find(p => p.codigo == codigo);
    if(!producto){//Si el producto con el código especificado no existe:
        return Promise.reject("No existe ningún producto con código " + codigo);//Retornar este error
    }
    //Estas líneas ya no se ejecutan si el Promise.reject es ejecutado
    const index = productos.indexOf(producto);
    productos.splice(index, 1);//Remueve el producto indicado en la posición indicada, el 1 es el contador de elementos a eliminar
    return Promise.resolve(producto);//Retornar el producto eliminado
}

export default {
    all, filter, add, single, update, remove
}