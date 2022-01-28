//Importes de librerías:
import React, { useState } from "react"; //Import de useState para controlar los estados del arreglo de
//productos
import { Provider } from "react-redux";//Esta librería va a aplicar los siguientes conceptos:
//React genera contextos, los cuales se pueden compartir entre componentes, para compartir información
import ReactDOM from "react-dom";
import App from "./app";
import store from "./store";


const rootElement = document.getElementById("root");
//Un provider es un contexto, envolviendo al componente App
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    rootElement);

// async function test(){//Todo lo que devuelva promesas, ya no se trabajan como promesas, sino como código secuencial por el async
//     try {//Intentar utilizar la promesa
//         console.log("Antes del fetch");
//         //Fetch no está en node, se tendría que instalar, es muy común utilizar axions por lo mismo
//         //const promesa = fetch('http://localhost:5001/productos');//Http request hacia el back-end
//         const response = await axios.get('http://localhost:5001/productos');//El await permite que el código se trabaje de forma secuencial
//         const productos = response.data;//Como ya se le da tiempo a la promesa de arriba de responder, ya se puede obtener la data acá
//         console.log("Productos: ", productos);//Mostrar los productos una vez obtenidos    
//         console.log("Después de fetch: ", productos);
//     } catch (error) {//Si existe un error usando la promesa, se captura el error y se despliega en la consola
//         console.error("Error en el request: ", error);    
//     }
    
    
//     //Todo este código de abajo ya no se necesita gracias a que se usaron las palabras clave async y await:
//     // //Una promesa siempre se va a ejecutar de último, sin importar el orden en el código, pues éstas  devuelven un valor con el paso del tiempo, no es de forma
//     // //instantánea
//     // promesa
//     //     .then(response => response.data)//Lo único que interesa en esta promesa es la data
//     //     /*.then((response) => {//Se pueden encadenar promesas, esta promesa retorna una promesa, que se usará abajo de este .then
//     //         return response.json();
//     //     })*/
//     //     .then((data) => {
//     //         productos = data;
//     //         console.log("onSuccess: ", productos);//Mostrar los productos una vez obtenidos
//     //     })//Si la promesa se ejecutó correctamente, se ejecuta esta función
//     //     /*.then ((p) => {//Tiraba null pues el segundo .then no retorna nada
//     //         console.log("Tercer then: ", p);
//     //     })*/
//     //     .catch(() => {
//     //         console.log("onError");
//     //     });//Si la promesa tuvo problemas, ejecuta esta función

//     // /*function onSuccess(response){//Función indicando que el fetch se hizo exitosamente
//     //     productos = response;
//     //     console.log("onSuccess: ", productos);
//     // }*/

//     // /*function onError(){//Función indicando un error en la ejecución de la promesa
//     //     console.log("onError");
//     // }*/
    
// }