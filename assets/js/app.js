class Carrito{
    comprarProducto(e){
        e.preventDefault();
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement
            console.log(producto);
            
        }
    }


}


const carro = new Carrito ();
const carrito = document.getElementById('carrito');
const producto = document.getElementById('listaProductos');
const listaproductos = document.querySelector('#lista-carrito');

cargarEventos();

function cargarEventos(){
    producto.addEventListener('click',(e)=>{carro.comprarProducto(e)});
}