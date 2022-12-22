/*
Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1). 🟢

-La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia. 🟢

-Debe guardar objetos con el siguiente formato:
-id (se debe incrementar automáticamente, no enviarse desde el cuerpo) 🟢
-title (nombre del producto)
-description (descripción del producto)
-price (precio)
-thumbnail (ruta de imagen)
-code (código identificador)
-stock (número de piezas disponibles)

-Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo. 🟢

-Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto 🟢

-Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 🟢

-Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo. 🟢
*/

//Writing code

const fs = require('fs/promises')


class ProductManager{

    constructor(path){
        this.path = path
        this.fileExist()
    }

    //Crea un archivo en la ruta en caso que no exista.
    async fileExist(){
       try {await fs.readFile(this.path)}
       catch{
        console.log(`Se creó un nuevo archivo con la ruta "${this.path}"`)
        await fs.writeFile(this.path, JSON.stringify([]))
       } 
    }

    async addProduct(productObject){
        
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
        const dataLength = data.length + 1
        
        //Destructuring del objeto pasado por parámetros

        const {title, description, price, thumbnail, code, stock} = productObject;
        const newProduct = {
            title: title ?? "",
            description: description ?? "",
            price: price ?? "",
            thumbnail: thumbnail ?? "",
            code: code?? "",
            stock: stock ?? "",
            id: dataLength
            }


        //Validación de campos vacíos

        const validationArray = Object.values(newProduct)
        const emptyParam = validationArray.some(producto => producto === "")

        if (emptyParam) {
            console.log("No puede haber parámetros vacíos al cargar un producto.")
            return
        } 
        

        //valida que el codigo del producto no esté ya cargado

        const codeValidation = data.find( product => product.code === code )
        if (!codeValidation){
            data.push( newProduct )
            try{
                await fs.writeFile(this.path, JSON.stringify(data))
            }
            catch(error){
                console.log("Este es el error", error)
            }
            finally{
                console.log("Producto añadido")
            } 
        } else {
            console.log("Error: el producto ya está cargado")
            return
        }
    }

   async getProducts(){
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
        //console.log(data);
        return data
    }

    async getProductById(idProduct){
        //Leo el archivo y lo guardo para manipularlo
        const fileRead = await fs.readFile(this.path, 'utf-8');
        const data = JSON.parse(fileRead);
        
        //Valido que el id ingresado existe, si no existe toma el valor de 'false'
        const productExists =  data.find(product => product.id === idProduct) ?? false
        
        if (productExists === false) {
            console.log("Not Found")
            const indexProduct = false
            return {productExists, data, indexProduct}
        } 
         const indexProduct = data.findIndex((producto) => producto.id === idProduct)
        console.log("Producto:", productExists)
        return {productExists, data, indexProduct}
    }

    async updateProduct(idProduct, update ){
        const {productExists, data, indexProduct} = await this.getProductById(idProduct)

        if (productExists) {
            //Encuentro el indice del producto
           
           
            //Combino el producto existente con update
            data[indexProduct] ={...productExists, ...update}
            try{
                await fs.writeFile(this.path, JSON.stringify(data))
            }
            catch(error){
                console.log("Este es el error:", error)
            }
            finally{
                console.log("Producto actualizado")
            }
        } else {
            console.log("Error: producto no encontrado")
        }  
    }

    async deleteProduct( idProduct ){
        const {productExists, data, indexProduct} = await this.getProductById(idProduct)
 
        if (productExists) {
                      
            //Elimino producto con el indice
            data.splice(indexProduct, 1)
            try{
                await fs.writeFile(this.path, JSON.stringify(data))
                console.log("Producto eliminado")
            }
            catch(error){
                console.log("Este es el error:", error)
            }
        } else {
            console.log("Error: producto no encontrado")
        }  
    }
}

module.exports = ProductManager 

//Run the code
