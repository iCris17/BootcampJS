export const ui = {//Constante de este archivo que permite el uso de varias funciones
    onFormSubmit: (data) => {},//Envío del formulario
    onEliminarClick: (codigo) => {},//Eliminado de un producto
    onEditarClick: (codigo) => {},//Editado de un producto
    renderForm,//Renderizado (modificado visual) de un form
    renderTable,//Renderizado (modificado visual) de la tabla
};

const form = document.getElementsByTagName("form")[0];//Obtener el primer form que se encuentre en el documento html//Indicar por comodidad (y documentación) el tipo de campo de la variable de abajo
const inputCodigo = document.getElementById("codigo");//Input del código
const inputNombre = document.getElementById("nombre");//Input del nombre
const inputCantidad = document.getElementById("cantidad");//Input de la cantidad
const inputPrecio = document.getElementById("precio");//Input del precio
const selectCategoria = document.getElementById("categoria");//Select de la categoría
const tbody = document.getElementsByTagName("tbody")[0];//Obtener el primer tbody que se encuentre en el documento html
const cantidadTotalElement = document.getElementById("cantidadTotal");//Obtener la celda de la cantidad total
const precioTotalElement = document.getElementById("precioTotal");//Obtener la celda del precio total
const granTotalElement = document.getElementById("granTotal");//Obtener la celda del gran total

form.addEventListener("submit", (event) => {
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
    //Enviar del formulario los siguientes campos:
    ui.onFormSubmit({
        codigo,
        nombre,
        cantidad,
        precio,
        categoria
    });
});//Suscribirse a un evento, en este caso el submit del botón del form

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
            ui.onEliminarClick(item.codigo);//Se activa el evento de eliminado
        })
        //Se envía el evento (en este caso un click):
        editar.addEventListener("click", (event) => {
            event.preventDefault();//Se evita que refresque la página o modifique el link actual de la página
            ui.onEditarClick(item.codigo);//Se activa el evento de editado
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