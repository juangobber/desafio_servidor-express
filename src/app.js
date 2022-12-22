/*
CONSIGNA:
Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

ASPECTOS A INCLUIR
-Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos. 🟢

-Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos. 🟢

-El servidor debe contar con los siguientes endpoints:
ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados. 🟢

-Si no se recibe query de límite, se devolverán todos los productos 🟢

-Si se recibe un límite, sólo devolver el número de productos solicitados 🟢

-ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos. 🟢

*/

//Importo e inicializo express

const express = require('express')
const app = express()

//Importo ProductManager

const productManagment = require('../ProductManager.js')
const productos = new productManagment('./listadoProductos.json')

//Estructura del servidor

//Devuelve todos los productos y evalúa si hay limite
app.get('/products', async (req, res) => {
    try{
        //Pide todos los productos
        const products = await productos.getProducts()
        
        //Evalúa si existe una query "limit". Si recibe query, devuelve la cantidad, si no todos los productos.
        if (req.query.limit){
            res.send(products.slice(0,req.query.limit))
        } else {
            res.send(products)
        }
    }
    catch{res.send("hubo un error")
    } 
})

//Obtiene productos por ID mediante params
app.get('/products/:pid', async (req, res)=> {
    try {
    const requestedProduct = await productos.getProductById(+req.params.pid)
    //ProductExists llega como el objeto del producto o como falso en caso de no existir. Evalua si mostrar el producto, o mostrar mensaje de inexistencia del mismo. 
        if (requestedProduct.productExists === false) {
            res.send("El producto no existe")
        } else {
            res.send(requestedProduct.productExists)
        }
    }
    catch {
    res.send("hubo un error")
    }
})

//Puesta en marcha del servidor
app.listen(8080, () =>{
    console.log('Server is up and running on port 8080, babe')
})

