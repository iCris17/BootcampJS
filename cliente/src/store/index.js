//Importes de funciones de librerías o bien, variables de otros archivos:
import { applyMiddleware, combineReducers, createStore } from "redux";
import { createBrowserHistory } from "history";
import { connectRouter, routerMiddleware } from "connected-react-router";
import apiMiddleware from "./api-redux";
import * as storage from "./store";

const history = createBrowserHistory();

//Guardar el estado actual de los productos
//La diferencia entre localStorage y sessionStorage es:
//localStorage: Permite que los datos no se burren así se cierre el navegador
//sessionStorage: Permite que los datos persistan siempre que la sesión esté activa (que el navegador no se cierre)
//const savedState = localStorage.getItem("state");
//Si existe un valor en savedState, deserializarlo como JSON (que sería la segunda condicion) y guardarlo en esta variable
//const deserialized = savedState && JSON.parse(savedState);

//Archivo creado para refactorización del código. Este sirve para poner en funcionamiento tanto el store.js como el ui.js
//Este es el estado inicial
const preloadedState = {
    producto : {},//Producto seleccionado
    productos: []//Arreglo de productos que se generarán con los estados
};
//Middlewares a utilizar:
const middlewares = applyMiddleware(
    storage.loggerMiddleware,//Middleware para el log de los dispatch
    routerMiddleware(history),//Middleware para conectar las rutas
    apiMiddleware,//Middleware para consumir la API y conectarla al Front-End
    storage.agregarOModificarProductoMiddleware,//Middleware para agregar o modificar un producto
    //storage.generadorCodigoProductoBuilder(0),//Middleware para generar el código al momento de agregar un producto
    //storage.storageMiddleware, //Middleware para mantener productos almacenados en el navegador
);//Esta función permite encadenar varios middlewares

const reducer = combineReducers(
    {
        //Necesita una history, para controlar las rutas cuando cambian o se modifican
        router: connectRouter(history),//Reducer para conectar las rutas
        producto: storage.producto,
        productos: storage.productos
    }
);//Permite usar varios reducers

const store = createStore(reducer, preloadedState, middlewares);//Se genera una variable para modificar los estados iniciales
//El store puede recibir un tercer parámetro, el cual son los middlewares generados

export { history };
export default store;