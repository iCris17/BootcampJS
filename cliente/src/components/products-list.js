import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { productoEliminado, productoSeleccionado } from "../store/store";

const ProductItem = (prop) => {
    const producto = prop.producto;{/* Acá es cuando se usa la propiedad item, del parámetro recibido (recordando que se recibió key e item como propiedades 
    del parámetro) */ }
    const acciones = prop.acciones;
    return <tr>
        <td>{producto.codigo}</td>
            <td>{producto.nombre}</td>
            <td>{producto.cantidad}</td>
            <td>{producto.precio}</td>
            <td>{producto.total}</td>
            <td>
                <div className="btn-group">
                    <Link 
                        title="Editar" 
                        to={"editar/" + producto.codigo}
                        className="btn btn-sm btn-outline-secondary" >
                        <i className="bi bi-pencil-square"></i>
                    </Link>{/*Se podrían usar links en lugar de etiquetas <a> siempre que se estén utilizando rutas */}
                    {/* La propiedad to de arriba reescribe el resto del link del front */}
                    <a 
                        title="Eliminar" 
                        href="#" 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => acciones.eliminar(producto.codigo)}>
                        <i className="bi bi-trash"></i>
                    </a>
                </div>
            </td>
    </tr>;
}

const ProductsList = () => {
    
    //Arreglo de productos para agregarlos al form
    const productos = useSelector((state) => state.productos);//useSelector recibe el estado, y retorna parte del estado que queremos
    
    //Variable para acceder al dispatch
    const dispatch = useDispatch();

    //Se usa cuando se van a hacer llamadas asíncronas, o se hace algo que afecte el renderizado de un componente
    useEffect(() => {
        dispatch({ type: "obtener-productos" });//Se hace un dispatch para obtener los productos
    }, []//Dependencias para ejecutar el useEffect(), en este caso, se le dice que no lo ejecute sin importar que cambien las variables del dispatch()
    )

    //Acción para seleccionar un producto
    //Ya no se usa pues al momento de usar rutas, no sirve de nada
    //const seleccionar = (codigo) => dispatch(productoSeleccionado(codigo));
    
    //Acción para eliminar un producto
    const eliminar = (codigo) => dispatch(productoEliminado(codigo));
    
    //Las acciones que se habían declarado, se agregan a este objeto de constantes
    const acciones = {
        //seleccionar,
        eliminar
    }
    
    //Para cada elemento de los resultados generales de cantidad, precio y total, se llama a una función sum, enviándoles los productos y
    //un arrow function:
    const cantidadTotal = sum(productos, x => x.cantidad);
    const precioTotal = sum(productos, x => x.precio);
    const granTotal = sum(productos, x => x.total);

    return <table className="table">{/*Creando la tabla*/}
        <thead>{/*Encabezado de la tabla*/}
            <tr>{/*Etiqueta que indica una fila de la tabla*/}
                <td>Código</td>{/*Etiqueta que indica una celda de la tabla*/}
                <td>Nombre</td>
                <td>Cantidad</td>
                <td>Precio</td>
                <td>Total</td>
            </tr>
        </thead>
        <tbody>{/*Cuerpo de la tabla que se usó de forma dinámica en el index.js*/}
            {productos.map(item => <ProductItem key={item.codigo} producto={item} acciones={acciones} />)}
            {/* Por cada producto, utilizar el componente ProductItem, el cual envía un parámetro con propiedades key(pedido obligatoriamente por React) y producto
            , para luego hacer uso de dicho componente únicamente la propiedad producto */}
        </tbody>
        <tfoot>{/*Footer de la tabla*/}
            <tr>
                <td colSpan="2">Totales</td>
                <td>{cantidadTotal}</td>{/* Redux directamente manipula las etiquetas html por nosotros, mientras teníamos que controlarlo con un innerHtml.element */}
                <td>{precioTotal}</td>
                <td>{granTotal}</td>
                <td></td>
            </tr>
        </tfoot>
    </table>;
}

//Esta función lo que hace, es obtener un arreglo de los productos, y por cada objeto del arreglo, se suma su cantidad/precio/total, pero
//en la función .reduce() se explica esto más a detalle
function sum(elementos, selector){
    return elementos
    .map(selector)
    .reduce((a, b) => a + b, 0);//Lo que se hace es, mandar dos parámetros, siendo a un número que ya se tiene, y b el número a sumar al parámetro a,
    //además, que es la acción del a + b que hay. a al principio no va a tener valor, así que se pone un 0 después, para indicar que por defecto el
    //valor de a es 0.
}

export default ProductsList;