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

let indice = 0;//El índice sirve para ir incrementando el código a medida que se inserta
let cantidadTotal = 0;//Cantidad total
let preciosTotales = 0;//Precio total
let granTotal = 0;//Gran total
let currentRow;//Fila actual que se edita o elimina
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
    let codigo = frmCodigo[1];//Obtener el código. Equivalente: values[0][1]
    const nombre = frmNombre[1];//Obtener el nombre. Equivalente: values[1][1]
    const cantidad = frmCantidad[1];//Obtener la cantidad. Equivalente: values[2][1]
    const precio = frmPrecio[1];//Obtener el precio. Equivalente: values[3][1]
    const categoria = frmCategoria[1];//Obtener la categoría. Equivalente: values[4][1]
    const total = cantidad * precio;//Calcular el precio

    cantidadTotal += parseFloat(cantidad);//Calculando el total de cantidades ingresadas
    preciosTotales += parseFloat(precio);//Calculando el total de precios ingresados
    granTotal += parseFloat(total);//Calculando el gran total

    let tr;

    if (!codigo){//Si no hay un código existente en el formulario ingresado (indicando que se está insertando, y no editando):
        codigo = ++indice;//Se incrementa el código
        tr = document.createElement("tr");//Se crea el documento
        tbody.appendChild(tr);//Y luego se anexa al tbody obtenido en esta variable
    }
    else{//Ahora bien, si existe un código en la fila obtenida (indicando que entonces se está editando):
        tr = currentRow;//Se obtiene dicha fila
    }
    
    tr.dataset.categoria = categoria;//Insertar a la fila creada (sin necesidad de que el input exista) la categoría
    tr.innerHTML = `
        <td>${codigo}</td>
        <td>${nombre}</td>
        <td>${cantidad}</td>
        <td>${precio}</td>
        <td>${total}</td>
        <td>
            <div class="btn-group">
                <a title="Editar" href="#" onclick="onEdit(event)" class="btn btn-sm btn-outline-secondary">
                    <i class="bi bi-pencil-square"></i>
                </a>
                <a title="Eliminar" href="#" onclick="onDelete(event)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                </a>
            </div>
        </td>
    `;//En los botones Editar y Eliminar (ambos con hipervínculo), el evento onclick llama a las funciones onEdit() y onDelete() respectivamente, enviando
    //el evento que en este caso es un click.
    //Generar HTML con la nueva fila dinámicamente
    
    cantidadTotalElement.innerText = cantidadTotal;//Asignar texto de cantidad total a la celda de cantidad total
    precioTotalElement.innerText = preciosTotales;//Asignar texto de precio total a la celda de precio total
    granTotalElement.innerText = granTotal;//Asignar texto de gran total a la celda de gran total
    form.reset();//Limpiar todo el formulario
    fnombre.focus();//Hacer focus de nuevo al campo nombre cuando se inserta/edita
}
/**
 * 
 * @param {Event} event //Documentar e identificar el tipo de dato que tiene la variable event
 */
function onEdit(event)//Función para editar que se suscribe a un evento y recibe un parámetro event
{
    event.preventDefault();//Evita acciones como refrescar la página o sobreescribir el link

    /** @type {HTMLAnchorElement} *///Indicar y documentar el tipo de dato de la siguiente variable
    const anchor = event.currentTarget;//Anclar al evento (parámetro) recibido, pero se ancla a la etiqueta que recibe el evento
    const tr = anchor.parentElement.parentElement.parentElement;//Se obtiene el padre del padre, que sería el tag <tr>, la sucesión sería así: <a> -> <td> -> <tr>
    const celdas = tr.getElementsByTagName("td");//Obtener todos los tag 'td' del tr que se quiere editar
    const [tdCodigo, tdNombre, tdCantidad, tdPrecio] = celdas;//Se crea un vector, asignando los valores de cada tag a cada variable asignada internamente
    //en el vector

    inputCodigo.value = tdCodigo.innerText;//Asignar al input de código, el código a editar
    inputNombre.value = tdNombre.innerText;//Asignar al input de nombre, el nombre a editar
    inputCantidad.value = tdCantidad.innerText;//Asignar al input de cantidad, la cantidad a editar
    inputPrecio.value = tdPrecio.innerText;//Asignar el input de precio, el precio a editar
    selectCategoria.value = tr.dataset.categoria;//Asignar al select de categoría, la categoría obtenida a editar

    currentRow = tr;//Asignar como fila actual, la fila obtenida
}

/**
 * 
 * @param {Event} event //Documentar e identificar el tipo de dato que tiene la variable event
 */
function onDelete(event)//Función para eliminar una fila
{
    event.preventDefault();//Evita acciones como refrescar la página o sobreescribir el link

    /** @type {HTMLAnchorElement} *///Indicar y documentar el tipo de dato de la siguiente variable
    const anchor = event.currentTarget;//Anclar al evento (parámetro) recibido
    const tr = anchor.parentElement.parentElement.parentElement;//Se obtiene el padre del padre, que sería el tag <tr>, la sucesión sería así: <a> -> <td> -> <tr>
    
    tbody.removeChild(tr);//Al ya haber obtenido el padre del padre, que es una fila, se procede a eliminar esta del body.
}