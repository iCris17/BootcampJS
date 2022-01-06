//Archivo de configuración para que webpack reconozca react, sus módulos e importes

const path = require("path");//Módulo para importar el path
const { CleanWebpackPlugin }= require("clean-webpack-plugin");//Al tener muchas clases dentro, se obtiene sólo la que se necesita
const HtmlWebpackPlugin = require("html-webpack-plugin");//Variable de importe para los plugins de webpack
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';//Verificar si no es ambiente de producción para asignar variable
const mode = isDevelopment ? 'development' : 'production';//Se ve si el modo es producción o desarrollo
const devPlugins = !isDevelopment ? [] : [ new ReactRefreshWebpackPlugin() ];//Si se está en modo develop, usar plugins, si no, no

//Esta variable se usa pues webpack no entiende la sintaxis de 'export const'
//Se usa sintaxis de node para ello
module.exports = {
    entry: "./src/index.js",//Ruta inicial a tomar
    output: {//Archivo de salida
        filename: "[name].[contenthash].js",//Nombre del archivo que se quiere
        path: path.resolve(__dirname, "dist"),//Folder a agregar el archivo. __dirname da la carpeta del archivo actual, el parámetro dist indica que
        //se almacene en esta carpeta el archivo especificado
        publicPath: ""//Variable que de momento no se usa
    },
    //mode: "production",//Se indica un modo (producción) para optimizar lo más que pueda el código
    mode: mode,
    devServer: {//Indicar variables para nuestro entorno
        port: 5000,//Puerto en el que se va a abrir nuestra aplicación
        open: true,//Indicar que se abra el navegador por defecto
        hot: true //Sólo se va a refrescar en el navegador lo que se necesita, no toda la página
    },
    module: {//Se especifican los módulos
        rules: [//Se especifican reglas para indicar a webpack cómo procesar cada archivo
            {
                use: "babel-loader",//Regla para usar babel-loader
                test: /.js$/,//Expresión regular indicando que los archivos terminados en .js se usen
                exclude: /node_modules///Se excluye el node_modules se excluyan
            },
            {
                //use: ["style-loader", "css-loader"],//Regla para usar style y css loader
                use: [MiniCssExtractPlugin.loader, "css-loader"],//Regla para usar minicssextract y css loader
                test: /.css$/ //Expresión regular indicando que los archivos terminados en .css se usen
                //El símbolo de dólar al final de la expresión regular indica que debe terminar exactamente así
            },
            {
                type: "asset",
                test: /.(png|svg|jpg|jpeg|gif)$/i//Se tratarán todos estos archivos como assets
            }            
        ]
    },
    plugins: [//Acá van todos los plugins de webpack
        ...devPlugins,
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"//Nombre del archivo a reducir tamaño
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html"//Template que queremos usar
        })
    ]
}