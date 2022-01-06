import React from "react";

//El encabezado que se muestra
export const Encabezado = (prop) => (
    <h1>
       {prop.titulo}: {prop.valor}
    </h1>
);
//Mostrar cada producto individualmente
const Producto = (prop) => (
    <li className="producto" onClick={(e) => prop.onProductClick(prop, e)}>
        Nombre: {prop.nombre}, Cantidad: {prop.cantidad}
    </li>
);

//Mostrar todos los productos, pero enviar al componente Producto cada propiedad
export const Productos = (prop) => (
    <ul>
      {/* Función que busca todos los productos, y les asigna una llave
    para identificarlos de forma única*/}
      {prop.productos.map((item) => (
        <Producto
          key={item.codigo}
          codigo={item.codigo}
          nombre={item.nombre}
          cantidad={item.cantidad}
          onProductClick={prop.onProductClick}
        />
      ))}
    </ul>
  );