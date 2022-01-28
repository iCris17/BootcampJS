import api from "./api";
import { push } from "connected-react-router";

const asignarProductos = (payload) => ({
    type: "asignar-productos",
    payload
});

const apiMiddleware = ({dispatch}) => (next) => async (action) => {//Middleware para consumir la API, del store sólo me interesa el dispatch
    switch (action.type) {
        case "obtener-productos":
        {
            const productos = await api.all();//Obtener productos
            //Dispatch para obtener todos los productos
            dispatch(asignarProductos(productos));
            break;
        }
        case "producto-agregado": {//Hay varias líneas de código porque hay varias soluciones de sincronizar el Front-End con el Back-End:
            await api.add(action.payload);//Hacer un post de un producto
            //Dispatch para obtener todos los productos
            dispatch(push("/"));//Dispatch para ir a la raíz
            //next({type: "producto-agregado", payload: producto});
            //No se recomienda el uso, ya que se ve cómo recarga la página
            //window.location.href = "/";//Al agregar, hacer que la aplicación regrese a la raíz, y no se quede estancado en el formulario
            break;
        }
        case "producto-modificado": {
            await api.update(action.payload);//Hacer un put de un producto
            //Dispatch para obtener todos los productos
            dispatch(push("/"));//Dispatch para ir a la raíz
            //No se recomienda el uso, ya que se ve cómo recarga la página
            //window.location.href = "/";//Al modificar, hacer que la aplicación regrese a la raíz, y no se quede estancado en el formulario
            break;
        }
        case "producto-eliminado": {
            await api.remove(action.payload.codigo);//Hacer un delete de un producto
            //Se vuelven obtener y asignar todos los productos, pues los cambios del Back-End no están sincronizados con el Front-End
            const productos = await api.all();//Obtener productos luego de hacer el post
            //Dispatch para obtener todos los productos
            dispatch(asignarProductos(productos))//Actualizar el estado en el Front-End
            break;
        }
        case "producto-seleccionado": {
            const { codigo } = action.payload;
            if (codigo){//Si viene un código en el action:
                const producto = await api.single(action.payload.codigo);//Obtener un único producto
                next({type: action.type, payload : producto});//Next para que continúe al reducer, asignando el producto
            } else {
                next({type: action.type, payload : {}});//Next para que continúe al reducer, asignando un producto vacío
            }
            break;
        }
        default:
            next(action);
            break;
    }
}

export default apiMiddleware;