import React from "react";
import './app.css';
import ProductForm from "./components/product-form";
import ProductsList from "./components/products-list";

const App = () => {
    return <main className="container">{/*A la mayoría de las etiquetas, por el hecho de usar BootStrap, se le añade una clase*/}
        <ProductForm />
        <ProductsList />
    </main>
}

export default App;