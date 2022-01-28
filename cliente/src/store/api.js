import axios from "axios";
const url = 'http://localhost:5001/productos/'

//Con esta función, se recibe un parámetro que decide qué request se quiere ejecutar
async function request(httpCall)
{
    const response = await httpCall();//Se ejecuta una función, llamada desde las otras funciones de abajo:
    return response.data;//Retornar la data obtenida
}

//Get de todos los productos
const all = () => request(() => axios.get(url));
//Get de un sólo producto, recibiendo como parámetro el código
const single = (codigo) => request(() => axios.get(url + codigo));
//Post de un producto, recibiendo como parámetro su mismo producto
const add = (producto => request(() => axios.post(url, producto)));
//Actualizar un producto, lo que se hace en el parámetro es que se pide que de lo que se recibe, me de sólo el código, y lo que no sea código, me de sus propiedades con sus
//valores
const update = ({ codigo, ...producto }) => request(() => axios.put(url + codigo, producto));
//Delete de un producto, recibiendo como parámetro el código
const remove = (codigo) => request(() => axios.delete(url + codigo));
//Exportar estas funciones
export default { all, single, add, update, remove }