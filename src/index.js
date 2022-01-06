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