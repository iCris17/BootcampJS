//Archivo refactorizado para permitir el insertado, modificado o eliminado de productos
//Objeto de acciones para el reducer utilizando variables y no repetir el contenido de las mismas en el archivo, facilitando el mantenimiento 
const ActionTypes = {
    ProductoAgregado: "producto-agregado",
    ProductoModificado: "producto-modificado",
    ProductoEliminado: "producto-eliminado",
    ProductoSeleccionado: "producto-seleccionado",
    ProductoAgregadoModificado: "producto-agregado-o-modificado",
};

//Este va a modificar el estado enviado, state son los productos que ya hay, y se van a agregar/modificar/eliminar, mientras                  
export const reducer = (state, action) => {
    //Un case dependiendo de la acción requerida
    switch(action.type){
        case ActionTypes.ProductoAgregado:
            return productoAgregadoReducer(state, action);
        case ActionTypes.ProductoModificado:
            return productoModificadoReducer(state, action);
        case ActionTypes.ProductoEliminado:
            return productoEliminadoReducer(state, action);
        case ActionTypes.ProductoSeleccionado:
            return productoSeleccionadoReducer(state, action);
        default:
            return state;//Si no, retorna el mismo estado
    }
};
//Función para seleccionar un producto
export const productoSeleccionado = (codigo) => ({
    type: ActionTypes.ProductoSeleccionado,
    payload: {
        codigo
    }
});
//Función para eliminar un producto
export const productoEliminado = (codigo) => ({
    type: ActionTypes.ProductoEliminado,
    payload: { codigo }
});
//Función para modificar un producto
export const productoModificado = (payload) => ({
    type: ActionTypes.ProductoModificado,
    payload 
});
//Función para agregar un producto
export const productoAgregado = (payload) => ({
    type: ActionTypes.ProductoAgregado,
    payload
});
//Función para indicar si se ha agregado o modificado un producto
export const agregarOModificarProducto = (payload) => ({
    type: ActionTypes.ProductoAgregadoModificado,
    payload
})


/*
//El middleware de Redux sirve para agregar funcionalidad sin necesidad de aplicar tanto código nuevo a la aplicación
function loggerMiddleware(store) {//Recibe un store como parámetro
    return function dispatchWrapper(next) {//Y retorna una función Wrapper, que lo que hace es tener control de lo que se hace en un dispatch al ejecutarlo
        return function actionHandler(action) {//El Wrapper retorna otra función, en el cual ya se pone código para control de errores, de data, etc.
            next(action);//La aplicación funciona sólo utilizando la función next y su parámetro action (que es lo que se va a hacer)
            const state = store.getState();//Guardar el estado después de ejecutarse el action
            console.log("dispatching", action);
            console.log("state", state);
        }
    }
}*/
//Es la misma sintaxis del middleware de arriba, pero resumida en un arrow function
export const loggerMiddleware = store => next => action => {
    console.log("dispatching", action);//Dispatch
    const result = next(action);//Se almacena la accion actual
    console.log("next state", store.getState());//Se obtiene el estado actual
    return result;//Se suele retornar el next del middleware actual como buena práctica,
    //se generan varios middlewares al momento de programar
}

export const storageMiddleware = store => next => action => {

    const actions = [
        ActionTypes.ProductoAgregado,
        ActionTypes.ProductoModificado,
        ActionTypes.ProductoEliminado
    ];
    const result = next(action);
    if (actions.indexOf(action.type) >= 0){//Si este tipo de acción no está en el arreglo:
        const state = store.getState();
        //el JSON.stringify() nos va a permitir convertir el state en una cadena en formato JSON
        localStorage.setItem("state", JSON.stringify(state));
    }

    return result;//Retornar el mismo estado si no se ingresa al if
}

export const agregarOModificarProductoMiddleware = store => next => action => {
    if (action.type != ActionTypes.ProductoAgregadoModificado){
        return next(action);
    }
    const producto = action.payload;
    //If ternario: condición ? expr1 : expr2
    //Traducido, si la condición se cumple, expr1 se lleva a cabo, si no, entonces expr2 se lleva a cabo
    //En este caso: si existe un código, se modifica el producto, si no, solamente se agrega
    const actionToDispatch = producto.codigo ? 
    productoModificado(producto) : 
    productoAgregado(producto);
    store.dispatch(actionToDispatch);
    //Al enviar el form, el producto seleccionado va a ser null, para dejar el form por defecto como estaba:
    return store.dispatch(productoSeleccionado(null));
}
//Seleccionar un producto
function productoSeleccionadoReducer(state, action) {
    const codigo = action.payload.codigo; //Se obtiene el código del producto seleccionado
    return {
        ...state,
        producto: state.productos.find(x => x.codigo == codigo) || {}
    };
}
//Eliminar un producto
function productoEliminadoReducer(state, action) {
    const codigo = action.payload.codigo; //Se obtiene el código del producto
    const productos = state.productos.filter((item) => item.codigo != codigo); //Es parecido al find(), con la única diferencia de que va a obtener todos
    //los objetos que no tengan el código del producto que se quiere eliminar
    return {
        ...state,
        productos
    };
}
//Modificar un producto
function productoModificadoReducer(state, action) {
    const producto = action.payload; //Se obtiene el nuevo producto a partir del payload
    const productos = state.productos.slice(); //Si al slice se le indican parámetros como: (inicio, final), entonces se toma ese trozo del array de productos,

    //ahora bien, si se manda sólo un parámetro: (index), se obtiene el array desde esa posición hasta el final, si no se manda ningun parámetro, manda todo
    //el array.
    const codigo = producto.codigo; //Obtener el código del producto
    const total = producto.cantidad * producto.precio; //Calcular el total del producto
    const old = productos.find((item) => item.codigo == codigo); //Este por ser un arreglo (y cada arreglo) tiene una propiedad find(), el cual recibe como
    //parámetro una función. En la función, se envía como parámetro un objeto (producto), y se busca en cada objeto del arreglo si algún código es igual
    //al que se obtuvo antes, de ser asi, se retorna el objeto entero
    
    const index = productos.indexOf(old); //Se obtiene el índice donde se encuentra el objeto obtenido arriba
    productos[index] = { ...producto, total }; //Se procede a actualizar el producto modificado, incluído su total
    return {
        ...state,
        productos
    };
}
//Agregar un producto
function productoAgregadoReducer(state, action) {
    const producto = action.payload; //Se obtiene el objeto del producto creado con sus propiedades
    const total = producto.cantidad * producto.precio; //Se calcula el total
    return {
        ...state,
        productos: [
            ...state.productos,
            {
                ...producto,

                //Y como se está agregando el producto, se añade un nuevo código y se calcula el total
                total
            }
        ]
    };
}
//Generar código para un producto nuevo
export function generadorCodigoProductoBuilder(codigoInicial){
    let codigo = codigoInicial;//Crear el código a partir del parámetro recibido
    return store => next => action => {
        if (action.type != ActionTypes.ProductoAgregado)
        {
            return next(action);//Si en este middleware se detecta que no se está agregando el producto se regresa el mismo estado
        }
    
        codigo++;
        const actionToDispatch = {
            ...action,
            payload: {
                ...action.payload,
                codigo
            }
        };
        return next(actionToDispatch);//Si no, se agrega un nuevo producto con su respectivo código
    };
}