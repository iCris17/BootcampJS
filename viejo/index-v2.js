const form = document.getElementsByTagName("form")[0];//Obtener el primer form que se encuentre en el documento html
/** @type {HTMLInputElement} *///Indicar por comodidad (y documentación) el tipo de campo de la variable de abajo
const inputCodigo = document.getElementById("codigo");//Input del código
/** @type {HTMLInputElement} */
const inputNombre = document.getElementById("nombre");//Input del nombre
/** @type {HTMLInputElement} */
const inputCantidad = document.getElementById("cantidad");//Input de la cantidad
/** @type {HTMLInputElement} */
const inputPrecio = document.getElementById("precio");//Input del precio
/** @type {HTMLInputElement} */
const selectCategoria = document.getElementById("categoria");//Select de la categoría
const tbody = document.getElementsByTagName("tbody")[0];//Obtener el primer tbody que se encuentre en el documento html
const cantidadTotalElement = document.getElementById("cantidadTotal");//Obtener la celda de la cantidad total
const precioTotalElement = document.getElementById("precioTotal");//Obtener la celda del precio total
const granTotalElement = document.getElementById("granTotal");//Obtener la celda del gran total
/** @type {HTMLElement} */
const fnombre = document.getElementById("nombre");//Se obtiene el input de nombre para hacer focus más adelante

//Este es el estado inicial
const preloadedState = {
    producto : {},//Producto seleccionado
    productos: []//Arreglo de productos que se generarán con los estados
};

let indice = 0;//Se declara un índice para llevar el control del código de cada fila
//Este va a modificar el estado enviado, state son los productos que ya hay, y se van a agregar/modificar/eliminar, mientras                  
const reducer = (state, action) => {
    //Si sólo se va a agregar un producto:
    if (action.type == "producto-agregado"){
        indice++;//Se incrementa el código al simplemente agregar un producto
        const producto = action.payload;//Se obtiene el objeto del producto creado con sus propiedades
        const codigo = indice;//El código que se añade es el del índice
        const total = producto.cantidad * producto.precio;//Se calcula el total
        return {//Se crea este producto, modificando el estado actual
            ...state,//Se retornan las mismas características del estado recibido (el state es como un historial de transacciones realizadas)
            productos: [//Se modifica el estado actual, en este caso se añaden nuevos productos
                ...state.productos,//Se añaden al arreglo los productos que ya existían gracias al historial que se lleva
                {//Se agrega el nuevo objeto (producto)
                    ...producto,//Se declara como propiedad el producto creado, con las características del payload
                    //Y como se está agregando el producto, se añade un nuevo código y se calcula el total
                    codigo, //Es igual a poner: codigo: codigo
                    total //Es igual a poner: total: total
                }
            ]
        };
    }
    //Ahora bien, si el producto más bien se va a modificar:
    else if (action.type == "producto-modificado"){
        const producto = action.payload;//Se obtiene el nuevo producto a partir del payload
        const productos = state.productos.slice();//Si al slice se le indican parámetros como: (inicio, final), entonces se toma ese trozo del array de productos,
        //ahora bien, si se manda sólo un parámetro: (index), se obtiene el array desde esa posición hasta el final, si no se manda ningun parámetro, manda todo
        //el array.

        const codigo = producto.codigo;//Obtener el código del producto
        const total = producto.cantidad * producto.precio;//Calcular el total del producto
        const old = productos.find((item) => item.codigo == codigo)//Este por ser un arreglo (y cada arreglo) tiene una propiedad find(), el cual recibe como
        //parámetro una función. En la función, se envía como parámetro un objeto (producto), y se busca en cada objeto del arreglo si algún código es igual
        //al que se obtuvo antes, de ser asi, se retorna el objeto entero

        const index = productos.indexOf(old);//Se obtiene el índice donde se encuentra el objeto obtenido arriba
        productos[index] = {...producto, total };//Se procede a actualizar el producto modificado, incluído su total
        return {
            ...state,//Se retorna el estado actual
            productos//Y se retornan también los productos actualizados
        }
    }
    //Si en realidad el producto se va a eliminar:
    else if (action.type == "producto-eliminado"){
        const codigo = action.payload.codigo;//Se obtiene el código del producto
        const productos = state.productos.filter((item) => item.codigo != codigo);//Es parecido al find(), con la única diferencia de que va a obtener todos
        //los objetos que no tengan el código del producto que se quiere eliminar

        return {
            ...state,//Se retorna el estado actual
            productos//Y se retornan también los productos actualizados sin el eliminado
        }
    }
    //Por último, si solamente se va a seleccionar un producto:
    else if (action.type == "producto-seleccionado"){
        const codigo = action.payload.codigo;//Se obtiene el código del producto seleccionado
        return {
            ...state,//Se retorna el estado actual
            producto: state.productos.find(x => x.codigo == codigo) || {}//Y se busca al producto seleccionado, si no se ha seleccionado ninguno, simplemente
            //devuelve un objeto vacío
        }
    }

    return state;//Si no se sabe el tipo de acción, devuelve el mismo estado
}

const store = Redux.createStore(reducer, preloadedState);//Se genera una variable para modificar los estados iniciales

let latestState;//Se obtiene el último estado antes del cambio de estado
//Se suscribe a los eventos de la variable store
store.subscribe(() => {
    let currentState = store.getState();//Se obtiene el nuevo estado
    if (currentState != latestState){//Si el nuevo estado es diferente al anterior:
        latestState = currentState;//El último estado desplegado ahora es el nuevo estado enviado;
        console.log("estado: ", currentState);//Se despliega el estado actual en la consola.
        renderForm(currentState.producto);//Colocar valores a los inputs/selects del form
        renderTable(currentState.productos);//Se actualiza la tabla de productos, enviando los productos del estado actual
    }
});
//Función para obtener los campos del producto a modificar
function renderForm(producto){
    inputCodigo.value = producto.codigo || "";//Rellenar el input de código con el valor de código a modificar, si no existe, dejar el campo vacío
    inputNombre.value = producto.nombre || "";//Rellenar el input de nombre con el valor de nombre a modificar, si no existe, dejar el campo vacío
    inputCantidad.value = producto.cantidad || "";//Rellenar el input de cantidad con el valor de cantidad a modificar, si no existe, dejar el campo vacío
    inputPrecio.value = producto.precio || "";//Rellenar el input de precio con el valor de precio a modificar, si no existe, dejar el campo vacío
    selectCategoria.value = producto.categoria || 1;//Rellenar el select de categoría con el valor del select de categoría a modificar, si no existe, dejar el campo vacío
}
//Esta función recibe un parámetro, el cual son los productos del estado actual
function renderTable(productos){
    //Se obtienen las filas de la tabla, por medio del map(), muy similar al forEach(), la diferencia es que este sí retorna un valor.
    //Se envía un parámetro (llamado item, que sería un objeto de producto), así hasta que ya no se encuentran más productos en el arreglo.
    const filas = productos.map((item) => {
        const tr = document.createElement("tr");//Se crea el documento
        tr.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>${item.precio}</td>
            <td>${item.total}</td>
            <td>
                <div class="btn-group">
                    <a title="Editar" href="#" class="btn btn-sm btn-outline-secondary">
                        <i class="bi bi-pencil-square"></i>
                    </a>
                    <a title="Eliminar" href="#" class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i>
                    </a>
                </div>
            </td>
        `;//En los botones Editar y Eliminar (ambos con hipervínculo), el evento onclick llama a las funciones onEdit() y onDelete() respectivamente, enviando
        //el evento que en este caso es un click.
        //Generar HTML con la nueva fila dinámicamente

        //Se obtienen los botones de editar y eliminar, siendo editar la posición 0 y eliminar la posición 1, pues JavaScript permite el uso de esa sintaxis
        const [editar, eliminar] = tr.getElementsByTagName("a");
        //Se suscribe al evento de eliminar:
        //Se envía el evento (en este caso un click):
        eliminar.addEventListener("click", (event) => {
            event.preventDefault();//Se evita que refresque la página o modifique el link actual de la página
            store.dispatch({//Se hace la acción de eliminado de producto:
                type: "producto-eliminado",
                payload: {
                    codigo: item.codigo
                }
            })
        })
        //Se envía el evento (en este caso un click):
        editar.addEventListener("click", (event) => {
            event.preventDefault();//Se evita que refresque la página o modifique el link actual de la página
            store.dispatch({//Se hace la acción de selección de producto:
                type: "producto-seleccionado",
                payload: {
                    codigo: item.codigo
                }
            });
        })
        //Se retorna esta fila
        return tr;
    });
    //Se limpia el tbody de la tabla
    tbody.innerHTML = "";
    //A esta constante, por cada <tr> que se obtiene:
    filas.forEach((tr) => {
        tbody.append(tr);//Se anexa dicho <tr> al cuerpo de la tabla
    });

    //Para cada elemento de los resultados generales de cantidad, precio y total, se llama a una función sum, enviándoles los productos y
    //un arrow function:
    cantidadTotalElement.innerText = sum(productos, x => x.cantidad);
    precioTotalElement.innerText = sum(productos, x => x.precio);
    granTotalElement.innerText = sum(productos, x => x.total);

    //Esta función lo que hace, es obtener un arreglo de los productos, y por cada objeto del arreglo, se suma su cantidad/precio/total, pero
    //en la función .reduce() se explica esto más a detalle
    function sum(elementos, selector){
        return elementos
        .map(selector)
        .reduce((a, b) => a + b, 0);//Lo que se hace es, mandar dos parámetros, siendo a un número que ya se tiene, y b el número a sumar al parámetro a,
        //además, que es la acción del a + b que hay. a al principio no va a tener valor, así que se pone un 0 después, para indicar que por defecto el
        //valor de a es 0.
    }
}

form.addEventListener("submit", onSubmit);//Suscribirse a un evento, en este caso el submit del botón del form

/**
 * 
 * @param {Event} event//Indicar por comodidad el tipo de dato del parámetro event, para tener una guía más clara de las funciones que se pueden usar con
 * //Este parámetro
 */

function onSubmit(event)//Se van a quitar las características por defecto del submit, para personalizarlo
{
    event.preventDefault();//Evitar un submit por defecto que refresque la página y que sobreescriba el link

    const data = new FormData(form);//Crear un form data, para obtener todos los campos del form
    const values = Array.from(data.entries());//Obtener un arreglo de valores a partir del form data
    //A continuación se muestra el equivalente en código:
    //     values[0]  values[1]  values[2]    values[3]  values[4]
    const [frmCodigo, frmNombre, frmCantidad, frmPrecio, frmCategoria] = values;//Se crea una matriz, y se les asigna el valor de cada celda del values,
    //el cual es un vector en cada fila de la matriz de dos posiciones.
    
    //La variable data tiene un form data, mientras que el values hace que se puedan obtener de forma sencilla las entradas del form data, teniendo algo como:
    //0: {codigo, <valor>}
    //1: {nombre, <valor>}
    //Y así sucesivamente, se obtiene un arreglo en cada posición de la matriz, del cual el primer valor es la posición [0] y el segundo valor es [1].
    const codigo = parseInt(frmCodigo[1]);//Obtener el código. Equivalente: values[0][1]
    const nombre = frmNombre[1];//Obtener el nombre. Equivalente: values[1][1]
    const cantidad = parseFloat(frmCantidad[1]);//Obtener la cantidad. Equivalente: values[2][1]
    const precio = parseFloat(frmPrecio[1]);//Obtener el precio. Equivalente: values[3][1]
    const categoria = parseInt(frmCategoria[1]);//Obtener la categoría. Equivalente: values[4][1]
    //Si existe un producto seleccionado:
    if (codigo){
        store.dispatch({//Se modifica dicho producto
            type: "producto-modificado",
            payload: {
                codigo,
                nombre,
                cantidad,
                precio,
                categoria
            }
        })
    }
    else {//Ahora si no, quiere decir que el producto se quiere agregar:
        store.dispatch({
            type: "producto-agregado",
            payload: {
                nombre,
                cantidad,
                precio,
                categoria
            }
        })
    }

    store.dispatch({//Al enviar el form, el producto seleccionado va a ser null, para dejar el form por defecto como estaba:
        type: "producto-seleccionado",
        payload: {
            codigo: null
        }
    });
}


//Estos dispatch sirven para indicar que se haga una acción (agregar, modificar...)
store.dispatch({
    type: "producto-agregado",
    payload: {
        nombre: "prueba a",
        cantidad: 3,
        precio: 10,
        categoria: 2
    }
});

store.dispatch({
    type: "producto-modificado",
    payload: {
        codigo: 1,
        nombre: "prueba a v2",
        cantidad: 4,
        precio: 11,
        categoria: 1
    }
});

store.dispatch({
    type: "producto-agregado",
    payload: {
        nombre: "prueba b",
        cantidad: 6,
        precio: 8,
        categoria: 3
    }
});

store.dispatch({
    type: "producto-agregado",
    payload: {
        nombre: "prueba c",
        cantidad: 2,
        precio: 4,
        categoria: 4
    }
});

store.dispatch({
    type: "producto-eliminado",
    payload: {
        codigo: 2
    }
});