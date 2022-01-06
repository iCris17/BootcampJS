//Importes de funciones de librerías o bien, variables de otros archivos:
import { applyMiddleware, createStore } from "redux";
import * as $store from "./store";

//Guardar el estado actual de los productos
//La diferencia entre localStorage y sessionStorage es:
//localStorage: Permite que los datos no se burren así se cierre el navegador
//sessionStorage: Permite que los datos persistan siempre que la sesión esté activa (que el navegador no se cierre)
const savedState = localStorage.getItem("state");
//Si existe un valor en savedState, deserializarlo como JSON (que sería la segunda condicion) y guardarlo en esta variable
const deserialized = savedState && JSON.parse(savedState);

//Archivo creado para refactorización del código. Este sirve para poner en funcionamiento tanto el store.js como el ui.js
//Este es el estado inicial
const preloadedState = deserialized || {
    producto : {},//Producto seleccionado
    productos: []//Arreglo de productos que se generarán con los estados
};
//Middlewares a utilizar:
const middlewares = applyMiddleware(
    $store.loggerMiddleware,//Middleware para el log de los dispatch
    $store.agregarOModificarProductoMiddleware,//Middleware para agregar o modificar un producto
    $store.generadorCodigoProductoBuilder(0),//Middleware para generar el código al momento de agregar un producto
    $store.storageMiddleware, //Middleware para mantener productos almacenados en el navegador
);//Esta función permite encadenar varios middlewares

const store = createStore($store.reducer, preloadedState, middlewares);//Se genera una variable para modificar los estados iniciales
//El store puede recibir un tercer parámetro, el cual son los middlewares generados

export default store;