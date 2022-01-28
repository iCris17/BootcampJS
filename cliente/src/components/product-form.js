import React, { useEffect, useState } from "react";//La librería useState se usa para modificar los estados en React
import { useDispatch, useSelector } from "react-redux"; //Dispatch para el uso de Redux con React
import { useParams } from "react-router-dom";
import { agregarOModificarProducto, productoSeleccionado } from "../store/store";//Import del método en el store/store

const ProductForm = () => {
    //Categorías para agregar en el select de categorías
    const categorias = [
        { codigo: 1, nombre: 'Categoría 1' },
        { codigo: 2, nombre: 'Categoría 2' },
        { codigo: 3, nombre: 'Categoría 3' },
        { codigo: 4, nombre: 'Categoría 4' }
    ];

    const { codigo } = useParams();//Obtiene el código, gracias al patrón de link indicado en el archivo app.js. Me interesa sólo el código, por eso la sintaxis
    
    //Se obtiene el producto seleccionado
    const producto = useSelector((state) => state.producto);

    //Variable para acceder al dispatch
    const dispatch = useDispatch();

    //Lo que se hace es que useState() devuelve dos valores, el primero es el estado actual, y el segundo, es una función que va a permitir modificar 
    //el estado actual
    const [values, setValues] = useState({//Estado inicial:
        codigo: 0,
        nombre: '',
        cantidad: '',
        precio: '',
        categoria: 1
    });
    //Sincronizar React con Redux para cambiar estados, pues React no sabe que un estado se está actualizando
    useEffect(() => {
        setValues({//Cada vez que cambie algún valor del producto, se actualizan los valores del formulario
            codigo: producto.codigo || 0,
            nombre: producto.nombre || '',
            cantidad: producto.cantidad || '',
            precio: producto.precio || '',
            categoria: producto.categoria || 1
        })

        if (codigo != producto.codigo){//Si el código del producto de la url es distinto al código del producto cargado en pantalla:
            dispatch(productoSeleccionado(codigo));//Se selecciona a ese producto
        }

    }, [producto]//Se está escuchando al estado, para sincronizar los cambios que se hacen, para que React se entere
    );

    //Captura un evento (lo más probable es que sea un click en alguna fila)
    const onChange = (event) => {
        const target = event.target;//se captura la fila clickeada, la etiqueta completa del html
        const value = target.value;//Se obtiene el valor del campo editado (sea nombre, cantidad, precio o categoría)
        const name = target.name;//Obtiene el nombre (supondré que el id) del campo editado
        setValues((v) => ({//Se cambia el estado, por consiguiente los productos también
            ...v,//Este es el estado actual del formulario
            [name]: value//Permite que en el renderizado, se refleje lo que uno quiere escribir o modificar en cada respectivo campo
        }));
    }
    //Suscripción al evento onSubmit del formulario
    const onSubmit = (event) => {
        event.preventDefault();
        const payload = {//Este payload se crea para evitar que los totales de cantidad, precio y precio total se concatenen por ser strings,
            //y se hace la conversión respectiva de estos campos a valores numéricos
            ...values,
            cantidad: parseInt(values.cantidad),
            precio: parseFloat(values.precio)
        }
        dispatch(agregarOModificarProducto(payload));
    }
    //Por lo que noté, es una variable que verifica si el estado tiene un valor para nombre, cantidad y precio, si los tres campos tienen valor,
    //se activa el botón de guardado, si no, se desactiva
    const canSave = !!(values.nombre && values.cantidad && values.precio);

    return <form action="index.html" onSubmit={onSubmit}>{/*El action indica a qué archivo se va a enviar el formulario*/}
        <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" autoFocus name="nombre" id="nombre" className="form-control" value={values.nombre} onChange={onChange}/>{/*<!--El autofocus es para que al iniciar el navegador, se haga focus al campo de nombre*/}
        </div>
        <div className="mb-3">
            <label htmlFor="cantidad" className="form-label">Cantidad</label>
            <input type="number" name="cantidad" id="cantidad" className="form-control" value={values.cantidad} onChange={onChange}/>
        </div>
        <div className="mb-3">
            <label htmlFor="precio" className="form-label">Precio</label>
            <div className="input-group">
                <span className="input-group-text">Q</span>
                <input type="number" name="precio" id="precio" className="form-control" value={values.precio} onChange={onChange}/>
            </div>
        </div>
        <div className="mb-3">
            <label htmlFor="categoria" className="form-label">Categoría</label>
            <select name="categoria" id="categoria" className="form-control" value={values.categoria} onChange={onChange}> {/*En un select, siempre se incluyen opciones, y se les agrega un 'value'*/}
                { categorias.map(c => <option key={c.codigo} value={c.codigo}>{c.nombre}</option>)}
            </select>
        </div>
        <div className="mb-3">
            <button type="submit" className="btn btn-primary" disabled={!canSave}>Guardar</button>{/*Botón de tipo submit, para enviar un formulario*/}
        </div>
    </form>;
}

export default ProductForm;