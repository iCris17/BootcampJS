const juan = {
    nombre:"Juan",
    apellido: "Rodríguez",
    edad: 30,
    direccion: {
        departamentos: "Guatemala",
        municipio: "Guatemala"
    }
};
//const juan2 = Object.assign({}, juan, { apellido: "Pérez"});

const juan2 = {
    ...juan, 
    apellido: "Pérez", 
    telefono: "12345678",
    direccion:  {
        ...juan.direccion,
        municipio: "Santa Catarina Punula",
        aldrea: "Aldea 1"
    }
};

console.log("Juan: ", juan.direccion.departamentos);
console.log("Juan 2: ", juan2);

//Arreglos inmutables

const numeros = [1, 2, 3];

const numeros2 = [0, ...numeros, 4, ...numeros];

const index = numeros.indexOf(2);
const numeros3 = [
    ...numeros.slice(0, index),
    1.5,
    ...numeros.slice(index)

];

const numeros4 = numeros.filter(x => x != 2);

const numeros5 = numeros.map(x => x == 2 ? 100 : x)
/* x => x == 2 ? 100 : x
function reemplazar2Por100(x)
{
    if (x == 2)
        return 100;
    else
        return x;
}*/


/*
console.log("numeros: ", numeros);
console.log("numeros 2: ", numeros2);
console.log("numeros 3: ", numeros3);
console.log("numeros 4: ", numeros4);
console.log("numeros 5: ", numeros5);*/