import React from "react";
//BrowserRouter va a encerrar a los componentes, Switch es como un Switch-Case de JS, y Route es para definir las rutas
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import './app.css';
import { history } from "./store";
import ProductForm from "./components/product-form";
import ProductsList from "./components/products-list";

const App = () => {
    return <main className="container">{/*A la mayoría de las etiquetas, por el hecho de usar BootStrap, se le añade una clase*/}
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/nuevo">
                    <ProductForm />            
                </Route>
                <Route path="/editar/:codigo">
                    <ProductForm />            
                </Route>
                <Route path="/">
                    <Link to="/nuevo">Agregar</Link>
                    <ProductsList />
                </Route>
            </Switch>
        </ConnectedRouter>
    </main>
}

export default App;